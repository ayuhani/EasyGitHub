import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ListView,
  RefreshControl,
  DeviceEventEmitter
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import NavigationBar from '../common/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import TrendingItem from '../common/TrendingItem';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import Popover from '../common/Popover';
import TimeSpan from '../model/TimeSpan';
import ProjectModel from "../model/ProjectModel";
import FavoriteDao from '../expand/dao/FavoriteDao';
import Utils from '../util/Utils';
import ActionUtil from '../util/ActionUtil';
import {ACTION_HOME} from './HomePage';
import makeCancelable from '../util/Cancelable';
import ViewUtil from '../util/ViewUtil';
import MoreMenu, {MORE_MENU} from '../common/MoreMenu';
import {FLAG_TAB} from './HomePage';
import BaseComponent from './BaseComponent';
import CustomThemePage from './my/CustomThemePage';

const URL = 'https://github.com/trending/';
const timeSpanArray = [
  new TimeSpan('本 日', 'since=daily'),
  new TimeSpan('本 周', 'since=weekly'),
  new TimeSpan('本 月', 'since=monthly')];
var dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

export default class PopularPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
    this.state = {
      languages: [],
      isVisible: false,
      buttonRect: {},
      timeSpan: timeSpanArray[0],
      theme: this.props.theme,
      customThemeViewVisible: false,
    }
  }

  componentDidMount() {
    super.componentDidMount();
    // 组件挂载完成，加载本地的key
    this.loadLanguage();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  // 加载数据
  loadLanguage() {
    this.languageDao.fetch()
        .then(result => {
          this.setState({
            languages: result // 得到的是json格式数组对象
          });
        })
        .catch(error => {
          console.log(error);
        })
  }

  // 渲染头部的选择视图
  renderTitleView() {
    return <View>
      <TouchableOpacity
          ref="button"
          onPress={() => this.showPopover()}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 20, color: 'white', marginRight: 5}}>趋势</Text>
          <Text style={{fontSize: 20, color: 'white'}}>{this.state.timeSpan.showText}</Text>
          <Image
              style={{width: 12, height: 12, marginLeft: 5}}
              source={require('../../res/images/ic_spinner_triangle.png')}/>
        </View>
      </TouchableOpacity>
    </View>
  }

  // 弹出选择框
  showPopover() {
    this.refs.button.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisible: true,
        buttonRect: {x: px, y: py, width: width, height: height}
      });
    });
  }

  // 弹窗消失
  closePopover = () => {
    this.setState({
      isVisible: false
    })
  }

  // 点击选择框的item
  onSelectedTimeSpan(timeSpan) {
    this.setState({
      timeSpan: timeSpan,
      isVisible: false
    })
  }

  renderRightButton() {
    return <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {ViewUtil.getMoreButton(() => {
        this.refs.moreMenu.open();
      })}
    </View>;
  }

  renderMoreView() {
    let params = {...this.props, fromPage: FLAG_TAB.TB_TRENDING};
    return <MoreMenu
        ref="moreMenu"
        {...params}
        menus={[
          MORE_MENU.custom_language,
          MORE_MENU.sort_language,
          MORE_MENU.custom_theme,
          MORE_MENU.about_author,
          MORE_MENU.about]}
        anchorView={this.refs.moreMenuButton}
        showThemeView={() => this.setState({
          customThemeViewVisible: true
        })}/>
  }

  renderCustomThemeView() {
    return <CustomThemePage
        visible={this.state.customThemeViewVisible}
        {...this.props}
        onClose={() => this.setState({
          customThemeViewVisible: false
        })}
    />
  }

  render() {
    let content = this.state.languages.length > 0 ? <ScrollableTabView
        renderTabBar={() => <ScrollableTabBar/>}
        tabBarBackgroundColor={this.state.theme.themeColor}
        tabBarActiveTextColor="white"
        tabBarInactiveTextColor="mintcream"
        tabBarUnderlineStyle={{backgroundColor: 'white', height: 2}}
    >
      {this.state.languages.map((result, i, arr) => {
        let lan = arr[i];
        return lan.checked ?
            <TrendingTab
                tabLabel={lan.name}
                key={i}
                path={lan.path}
                timeSpan={this.state.timeSpan}
                {...this.props}></TrendingTab> : null;
      })}
    </ScrollableTabView> : null;
    let timeSpanView = <Popover
        contentStyle={{backgroundColor: '#343434', opacity: 0.9}}
        isVisible={this.state.isVisible}
        fromRect={this.state.buttonRect}
        placement="bottom"
        onClose={this.closePopover}>
      {timeSpanArray.map((result, i, arr) => {
        return <TouchableOpacity
            key={i}
            onPress={() => this.onSelectedTimeSpan(arr[i])}
        >
          <Text
              style={{fontSize: 18, color: 'white', padding: 5}}
          >{arr[i].showText}</Text>
        </TouchableOpacity>
      })}
    </Popover>;
    return (
        <View style={styles.container}>
          <NavigationBar
              style={this.state.theme.styles.navBar}
              statusBar={{backgroundColor: this.state.theme.themeColor}}
              leftButton={<View></View>}
              titleView={this.renderTitleView()}
              rightButton={this.renderRightButton()}
          />
          {content}
          {timeSpanView}
          {this.renderMoreView()}
          {this.renderCustomThemeView()}
        </View>
    );
  }
}

// 渲染每一页的列表
class TrendingTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isLoading: false,
      favoriteKeys: []
    };
  }

  /**
   * 拼接url
   * @param path 语言类别
   * @param timeSpan 今日 本周 本月
   * @returns {string}
   */
  getUrl(path, timeSpan) {
    return URL + path + '?' + timeSpan.searchText;
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('favoriteChanged_trending', () => {
      this.isFavoriteChanged = true;
    });
    this.loadData(this.props.timeSpan);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timeSpan !== this.props.timeSpan) {
      this.loadData(nextProps.timeSpan);
    } else if (this.isFavoriteChanged) {
      this.isFavoriteChanged = false;
      this.getFavoriteKeys();
    } else if (nextProps.theme !== this.props.theme) {
      this.flushFavoriteState()
    }
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
    this.cancelable && this.cancelable.cancel();
  }

  /**
   * 更新Project Item Favorite状态
   */
  flushFavoriteState() {
    let projectModels = [];
    let items = this.items;
    for (let i = 0; i < items.length; i++) {
      projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)));
    }
    this.updateState({
      dataSource: this.state.dataSource.cloneWithRows(projectModels),
      isLoading: false
    })
  }

  updateState(dic) {
    if (!this) return;
    this.setState(dic);
  }

  // 获取收藏的列表
  getFavoriteKeys() {
    favoriteDao.getFavoriteKeys()
        .then(keys => {
          if (keys) {
            this.updateState({
              favoriteKeys: keys
            })
          }
          this.flushFavoriteState();
        })
        .catch(e => {
          this.flushFavoriteState();
        })
  }

  loadData(timeSpan) {
    this.setState({
      isLoading: true
    });
    let url = this.getUrl(this.props.path, timeSpan);
    this.cancelable = makeCancelable(dataRepository.fetchRepository(url));
    this.cancelable.promise
        .then(result => {
          // 本地获取的是个object
          // 直接网络获取返回的是个数组
          this.items = result && result.items ? result.items : result ? result : [];
          this.getFavoriteKeys();
          if (result && result.update_date) {// 缓存
            if (!Utils.checkDate(result.update_date)) {
              DeviceEventEmitter.emit(ACTION_HOME.FlAG, ACTION_HOME.SHOW_TOAST, {text: '数据过时'});
              return dataRepository.fetchNetRepository(url);
            } else {
              DeviceEventEmitter.emit(ACTION_HOME.FlAG, ACTION_HOME.SHOW_TOAST, {text: '显示缓存数据'});
            }
          } else {
            DeviceEventEmitter.emit(ACTION_HOME.FlAG, ACTION_HOME.SHOW_TOAST, {text: '显示网络数据'});
          }
        })
        .then(items => {
          if (!items || items.length === 0) {
            return;
          }
          this.items = items;
          this.getFavoriteKeys();
          DeviceEventEmitter.emit(ACTION_HOME.FlAG, ACTION_HOME.SHOW_TOAST, {text: '显示网络数据'});
        })
        .catch(error => {
          console.log(error);
        })
  }

  // 渲染行
  renderRow(projectModel) {
    return <TrendingItem
        theme={this.props.theme}
        key={projectModel.rowData.fullName}
        projectModel={projectModel}
        onItemClick={() => ActionUtil.onItemClick({
          projectModel: projectModel,
          flag: FLAG_STORAGE.flag_trending,
          onUpdateAfterFavorite: () => this.getFavoriteKeys(),
          ...this.props
        })}
        onFavorite={(item, isFavorite) => ActionUtil.onFavorite(favoriteDao, item, isFavorite)}
    />
  }

  render() {
    return <View style={{flex: 1}}>
      <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.renderRow(rowData)}
          refreshControl={
            <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={() => this.loadData(this.props.timeSpan)}
                colors={[this.props.theme.themeColor]}
                tintColor={this.props.theme.themeColor}
                title='Loading...'
                titleColor={this.props.theme.themeColor}
            />
          }
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 20,
  }
})