import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
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

export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: []
    }
  }

  componentDidMount() {

  }

  render() {
    return (
        <View style={styles.container}>
          <NavigationBar
              title={'收藏'}
          />
          <ScrollableTabView
              renderTabBar={() => <ScrollableTabBar/>}
              tabBarBackgroundColor="#2196f3"
              tabBarActiveTextColor="white"
              tabBarInactiveTextColor="mintcream"
              tabBarUnderlineStyle={{backgroundColor: 'white', height: 2}}>
            <FavoriteTab tabLabel='最热' flag={FLAG_STORAGE.flag_popular} {...this.props}></FavoriteTab>
            <FavoriteTab tabLabel='趋势' flag={FLAG_STORAGE.flag_trending} {...this.props}></FavoriteTab>
          </ScrollableTabView>
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

  updateState(dic) {
    if (!this) return;
    this.setState(dic);
  }

  loadData() {
    this.favoriteDao.getAllItems()
        .then(items => {
          var resultData = [];
          for (let i = 0; i < items.length; i++) {
            resultData.push(new ProjectModel(items[i], true));
          }
          this.updateState({
            isLoading: false,
            dataSource: this.state.dataSource.cloneWithRows(resultData)
          })
        })
        .catch(e => {
          this.updateState({
            isLoading: false
          })
        })
  }

  /**
   * favoriteIcon的单击回调函数
   * @param item
   * @param isFavorite
   */
  onFavorite(item, isFavorite) {
    let key = item.id ? item.id.toString() : item.fullName;
    if (isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
    } else {
      this.favoriteDao.removeFavoriteItem(key);
      if (this.props.flag===FLAG_STORAGE.flag_popular){
        DeviceEventEmitter.emit('favoriteChanged_popular');
      }else {
        DeviceEventEmitter.emit('favoriteChanged_trending');
      }
    }
  }

  // item的点击事件
  onItemClick(projectModel) {
    this.props.navigator.push({
      component: RepositoryDetail,
      params: {
        projectModel: projectModel,
        flag: this.props.flag,
        onUpdateAfterFavorite: () => this.loadData(),
        ...this.props
      }
    })
  }

  renderRow(projectModel) {
    let ItemComponent = this.props.flag === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return <ItemComponent
        key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.rowData.id : projectModel.rowData.fullName}
        projectModel={projectModel}
        onItemClick={() => this.onItemClick(projectModel)}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
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