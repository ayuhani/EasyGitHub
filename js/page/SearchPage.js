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
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import {FLAG_STORAGE} from '../expand/dao/DataRepository';
import PopularItem from '../common/PopularItem';
import ProjectModel from "../model/ProjectModel";
import FavoriteDao from '../expand/dao/FavoriteDao';
import ActionUtil from '../util/ActionUtil';
import Utils from '../util/Utils';
import ViewUtil from '../util/ViewUtil';
import Toast, {DURATION} from 'react-native-easy-toast';
import GlobalStyle from '../../res/styles/GlobalStyle';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

/**
 * 搜索
 */
export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
    this.state = {
      isLoading: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,}),
      favoriteKeys: [],
      showBottomButton: false,
    }
  }

  getUrl(key) {
    return API_URL + key + QUERY_STR;
  }

  loadData() {
    this.updateState({
      isLoading: true,
    })
    fetch(this.getUrl(this.inputKey))
        .then(response => response.json())
        .then(responseData => {
          if (!this || !responseData || !responseData.items || responseData.items.length === 0) {
            this.updateState({isLoading: false, showBottomButton: false});
            this.toast.show('未找到与' + this.inputKey + '相关的内容', DURATION.LENGTH_SHORT);
            return;
          }
          this.items = responseData.items;
          this.getFavoriteKeys();
          this.updateState({showBottomButton: true})
        })
        .catch(e => {
          this.updateState({isLoading: false, showBottomButton: false})
        })
  }

  // 获取收藏的列表
  getFavoriteKeys() {
    this.favoriteDao.getFavoriteKeys()
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

  renderRow(projectModel) {
    return <PopularItem
        key={projectModel.rowData.id}
        projectModel={projectModel}
        onItemClick={() => ActionUtil.onItemClick({
          projectModel: projectModel,
          flag: FLAG_STORAGE.flag_popular,
          onUpdateAfterFavorite: () => this.loadData(),
          ...this.props
        })}
        onFavorite={(item, isFavorite) => {
          ActionUtil.onFavorite(this.favoriteDao, item, isFavorite);
          DeviceEventEmitter.emit('favoriteChanged_popular');
        }}
    />;
  }

  updateState(dic) {
    this.setState(dic);
  }

  onSearch() {
    let isLoading = this.state.isLoading;
    this.updateState({
      isLoading: !isLoading
    })
    if (!isLoading) {
      this.loadData()
    }
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
        onChangeText={text => this.inputKey = text}
    >
    </TextInput>;
    let rightButton = <TouchableOpacity
        onPress={() => {
          this.refs.input.blur();
          this.onSearch();
        }}
    >
      <Text style={styles.text}>{this.state.isLoading ? '取消' : '搜索'}</Text>
    </TouchableOpacity>;
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
    let bottomView = this.state.showBottomButton ?
        <TouchableOpacity style={[styles.bottmButton, styles.bgColor]}>
          <Text style={styles.text}>添加标签</Text>
        </TouchableOpacity> : null;
    return <View style={{flex: 1}}>
      {statusBar}
      {this.renderNavBar()}
      <View style={{flex: 1}}>
        <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
            enableEmptySections={true}
        />
        {this.state.isLoading && <ActivityIndicator
            style={styles.indicator}
            animating={this.state.isLoading}
            color='#2196f3'
            size={'large'}
        />}
      </View>
      {bottomView}
      <Toast ref={toast => this.toast = toast}/>
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
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  bottmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    opacity: 0.95,
    position: 'absolute',
    left: 10,
    top: GlobalStyle.window_height - 83,
    right: 10,
    bottom: 10
  }
})