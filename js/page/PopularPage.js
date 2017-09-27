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
import NavigationBar from '../common/NavigatorBar';
import DataRepository from '../expand/dao/DataRepository';
import RepositoryItem from '../common/RepositoryItem';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

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
    this.loadData();
  }

  // 加载数据
  loadData() {
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
        return lan.checked ? <PopularTab tabLabel={lan.name} key={i} path={lan.path}></PopularTab> : null;
      })}
    </ScrollableTabView> : null;
    return (
        <View style={styles.container}>
          <NavigationBar
              title={'最热'}
          />
          {content}
        </View>
    );
  }
}

// 渲染每一页的列表
class PopularTab extends Component {
  constructor(props) {
    super(props);
    this.dataRepository = new DataRepository();
    this.state = {
      result: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isLoading: false
    };
  }

  getUrl(key) {
    return URL + key + QUERY_STR;
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({
      isLoading: true
    });
    let url = this.getUrl(this.props.path);
    this.dataRepository
        .fetchRepository(url)
        .then(result => {
          // 本地获取的是个object
          // 直接网络获取返回的是个数组
          let items = result && result.items ? result.items : result ? result : [];
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(items),
            isLoading: false
          });
          if (result && result.update_date) {// 缓存
            if (!this.dataRepository.checkDate(result.update_date)) {
              DeviceEventEmitter.emit('showToast', '数据过时');
              return this.dataRepository.fetchNetRepository(url);
            } else {
              DeviceEventEmitter.emit('showToast', '显示缓存数据');
            }
          } else {
            DeviceEventEmitter.emit('showToast', '显示网络数据');
          }
        })
        .then(items => {
          if (!items || items.length === 0) {
            return;
          }
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(items),
          });
          DeviceEventEmitter.emit('showToast', '显示网络数据');
        })
        .catch(error => {
          console.log(error);
        })
  }

  renderRow(rowData) {
    return <RepositoryItem rowData={rowData}/>
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