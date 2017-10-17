import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ListView,
  RefreshControl,
  DeviceEventEmitter,
  TouchableOpacity,
  Image
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import NavigationBar from '../common/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import PopularItem from '../common/PopularItem';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import RepositoryDetail from "./RepositoryDetail";
import ProjectModel from "../model/ProjectModel";
import FavoriteDao from '../expand/dao/FavoriteDao';
import Utils from '../util/Utils';
import ActionUtil from '../util/ActionUtil';
import ViewUtil from '../util/ViewUtil';
import SearchPage from './SearchPage';
import {ACTION_HOME} from './HomePage';
import makeCancelable from '../util/Cancelable';
import MoreMenu, {MORE_MENU} from '../common/MoreMenu';
import {FLAG_TAB} from './HomePage';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
var dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.state = {
      languages: []
    }
  }

  componentDidMount() {
    // 组件挂载完成，加载本地的key
    this.loadLanguage();
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

  renderRightButton() {
    return <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity
          onPress={() => {
            this.props.navigator.push({
              component: SearchPage,
              params: {
                ...this.props
              }
            })
          }}
      >
        <View>
          <Image
              style={{width: 24, height: 24, margin: 8}}
              source={require('../../res/images/ic_search_white_48pt.png')}/>
        </View>
      </TouchableOpacity>
      {ViewUtil.getMoreButton(() => {
        this.refs.moreMenu.open();
      })}
    </View>;
  }

  renderMoreView() {
    let params = {...this.props, fromPage: FLAG_TAB.TB_POPULAR};
    return <MoreMenu
        ref="moreMenu"
        {...params}
        menus={[
          MORE_MENU.custom_key,
          MORE_MENU.sort_key,
          MORE_MENU.remove_key,
          MORE_MENU.custom_theme,
          MORE_MENU.about_author,
          MORE_MENU.about]}
        anchorView={this.refs.moreMenuButton}/>
  }

  render() {
    let content = this.state.languages.length > 0 ? <ScrollableTabView
        renderTabBar={() => <ScrollableTabBar/>}
        tabBarBackgroundColor="#2196f3"
        tabBarActiveTextColor="white"
        tabBarInactiveTextColor="mintcream"
        tabBarUnderlineStyle={{backgroundColor: 'white', height: 2}}
    >
      {this.state.languages.map((result, i, arr) => {
        let lan = arr[i];
        return lan.checked ?
            <PopularTab tabLabel={lan.name} key={i} path={lan.path} {...this.props}></PopularTab> : null;
      })}
    </ScrollableTabView> : null;
    return (
        <View style={styles.container}>
          <NavigationBar
              leftButton={<View></View>}
              title={'最热'}
              rightButton={this.renderRightButton()}
          />
          {content}
          {this.renderMoreView()}
        </View>
    )
        ;
  }
}

// 渲染每一页的列表
class PopularTab extends Component {
  constructor(props) {
    super(props);
    this.isFavoriteChanged = false;
    this.state = {
      result: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isLoading: false,
      favoriteKeys: []
    };
  }

  getUrl(key) {
    return URL + key + QUERY_STR;
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('favoriteChanged_popular', () => {
      this.isFavoriteChanged = true;
    });
    this.loadData();
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
    this.cancelable && this.cancelable.cancel();
  }

  componentWillReceiveProps(nextProps) {
    if (this.isFavoriteChanged) {
      this.isFavoriteChanged = false;
      this.getFavoriteKeys();
    }
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

  loadData() {
    this.setState({
      isLoading: true
    });
    let url = this.getUrl(this.props.path);
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
          this.updateState({
            isLoading: false
          })
        })
  }

  renderRow(projectModel) {
    return <PopularItem
        key={projectModel.rowData.id}
        projectModel={projectModel}
        onItemClick={() => ActionUtil.onItemClick({
          projectModel: projectModel,
          flag: FLAG_STORAGE.flag_popular,
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
                onRefresh={() => this.loadData()}
                colors={['#2196f3']}
                tintColor={'#2196f3'}
                title='Loading...'
                titleColor={'#2196f3'}
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