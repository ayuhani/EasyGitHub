import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  RefreshControl,
  DeviceEventEmitter,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity
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
import ViewUtil from '../util/ViewUtil';

/**
 * 搜索
 */
export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSeaching: false
    }
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
      if (this.props.flag === FLAG_STORAGE.flag_popular) {
        DeviceEventEmitter.emit('favoriteChanged_popular');
      } else {
        DeviceEventEmitter.emit('favoriteChanged_trending');
      }
    }
  }

  renderRow(projectModel) {
    let ItemComponent = this.props.flag === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return <ItemComponent
        key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.rowData.id : projectModel.rowData.fullName}
        projectModel={projectModel}
        onItemClick={() => ActionUtil.onItemClick({
          projectModel: projectModel,
          flag: this.props.flag,
          onUpdateAfterFavorite: () => this.loadData(),
          ...this.props
        })}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
    />;
  }

  updateState(dic) {
    this.setState(dic);
  }

  onSearch() {
    this.updateState({
      isSeaching: !this.state.isSeaching
    })
  }

  renderNavBar() {
    let backButton = ViewUtil.getLeftButton(() => {
      this.refs.input.blur();
      this.props.navigator.pop();
    });
    let inputView = <TextInput
        ref='input'
        style={styles.textInput}
        underlineColorAndroid={'white'}
    >
    </TextInput>;
    let rightButton = <TouchableOpacity
        onPress={() => {
          this.refs.input.blur();
          this.onSearch();
        }}
    >
      <Text style={styles.text}>{this.state.isSeaching ? '取消' : '搜索'}</Text>
    </TouchableOpacity>
    return <View style={[styles.navBar, styles.bgColor]}>
      {backButton}
      {inputView}
      {rightButton}
    </View>
  }

  render() {
    let statusBar = Platform.OS === 'ios' ? <View>
      <StatusBar/>
    </View> : null;
    return <View style={{flex: 1}}>
      {statusBar}
      {this.renderNavBar()}
      {/*<ListView*/}
      {/*dataSource={this.state.dataSource}*/}
      {/*renderRow={(rowData) => this.renderRow(rowData)}*/}
      {/*enableEmptySections={true}*/}
      {/*refreshControl={*/}
      {/*<RefreshControl*/}
      {/*refreshing={this.state.isLoading}*/}
      {/*onRefresh={() => this.loadData()}*/}
      {/*colors={['#2196f3']}*/}
      {/*tintColor={'#2196f3'}*/}
      {/*title='Loading...'*/}
      {/*titleColor={'#2196f3'}*/}
      {/*/>*/}
      {/*}*/}
      {/*/>*/}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 16,
    color: 'white',
    padding: 8
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 48 : 56
  },
  bgColor: {
    backgroundColor: '#2196f3'
  },
  textInput: {
    flex: 1,
    margin: 8,
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: 'white',
    borderRadius: 3,
    opacity: 0.7,
    color: 'white'
  }
})