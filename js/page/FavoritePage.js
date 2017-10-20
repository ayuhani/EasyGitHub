import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ListView,
  RefreshControl,
  DeviceEventEmitter
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import NavigationBar from '../common/NavigationBar';
import {FLAG_STORAGE} from '../expand/dao/DataRepository';
import PopularItem from '../common/PopularItem';
import TrendingItem from '../common/TrendingItem';
import RepositoryDetail from "./RepositoryDetail";
import ProjectModel from "../model/ProjectModel";
import FavoriteDao from '../expand/dao/FavoriteDao';
import ActionUtil from '../util/ActionUtil';
import makeCancelable from '../util/Cancelable';
import ViewUtil from '../util/ViewUtil';
import MoreMenu, {MORE_MENU} from '../common/MoreMenu';
import {FLAG_TAB} from './HomePage';
import BaseComponent from './BaseComponent';
import CustomThemePage from './my/CustomThemePage';

export default class FavoritePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = ({
      theme: this.props.theme,
      customThemeViewVisible: false,
    })
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  renderRightButton() {
    return <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {ViewUtil.getMoreButton(() => {
        this.refs.moreMenu.open();
      })}
    </View>;
  }

  renderMoreView() {
    let params = {...this.props, fromPage: FLAG_TAB.TB_FAVORITE};
    return <MoreMenu
        ref="moreMenu"
        {...params}
        menus={[
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
    let content = <ScrollableTabView
        renderTabBar={() => <ScrollableTabBar/>}
        tabBarBackgroundColor={this.state.theme.themeColor}
        tabBarActiveTextColor="white"
        tabBarInactiveTextColor="mintcream"
        tabBarUnderlineStyle={{backgroundColor: 'white', height: 2}}>
      <FavoriteTab tabLabel='最热' flag={FLAG_STORAGE.flag_popular} {...this.props}></FavoriteTab>
      <FavoriteTab tabLabel='趋势' flag={FLAG_STORAGE.flag_trending} {...this.props}></FavoriteTab>
    </ScrollableTabView>;
    return (
        <View style={styles.container}>
          <NavigationBar
              style={this.state.theme.styles.navBar}
              statusBar={{backgroundColor: this.state.theme.themeColor}}
              leftButton={<View></View>}
              title={'收藏'}
              rightButton={this.renderRightButton()}
          />
          {content}
          {this.renderMoreView()}
          {this.renderCustomThemeView()}
        </View>
    );
  }
}

// 渲染每一页的列表
class FavoriteTab extends Component {

  constructor(props) {
    super(props);
    this.favoriteDao = new FavoriteDao(this.props.flag);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isLoading: false,
    };
  }

  componentDidMount() {
    this.updateState({
      isLoading: true
    })
    this.loadData();
  }

  componentWillUnmount() {
    this.cancelable && this.cancelable.cancel();
  }

  updateState(dic) {
    if (!this) return;
    this.setState(dic);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.theme !== this.props.theme) {
      this.flushFavoriteState()
    }
  }

  flushFavoriteState() {
    let resultData = [];
    for (let i = 0; i < this.items.length; i++) {
      resultData.push(new ProjectModel(this.items[i], true));
    }
    this.updateState({
      isLoading: false,
      dataSource: this.state.dataSource.cloneWithRows(resultData)
    })
  }

  loadData() {
    this.cancelable = makeCancelable(this.favoriteDao.getAllItems());
    this.cancelable.promise
        .then(items => {
          this.items = items;
          this.flushFavoriteState();
        })
        .catch(e => {
          this.updateState({
            isLoading: false
          })
        })
  }

  renderRow(projectModel) {
    let ItemComponent = this.props.flag === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return <ItemComponent
        theme={this.props.theme}
        key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.rowData.id : projectModel.rowData.fullName}
        projectModel={projectModel}
        onItemClick={() => ActionUtil.onItemClick({
          projectModel: projectModel,
          flag: this.props.flag,
          onUpdateAfterFavorite: () => this.loadData(),
          ...this.props
        })}
        onFavorite={(item, isFavorite) => {
          ActionUtil.onFavorite(this.favoriteDao, item, isFavorite);
          if (this.props.flag === FLAG_STORAGE.flag_popular) {
            DeviceEventEmitter.emit('favoriteChanged_popular');
          } else {
            DeviceEventEmitter.emit('favoriteChanged_trending');
          }
        }}
    />;
  }

  render() {
    return <View style={{flex: 1}}>
      <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.renderRow(rowData)}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={() => this.loadData()}
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