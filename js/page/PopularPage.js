import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ListView,
  RefreshControl
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import NavigationBar from '../common/NavigatorBar';
import DataRepository from '../expand/dao/DataRepository';
import RepositoryItem from '../common/RepositoryItem';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

export default class PopularPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={styles.container}>
          <NavigationBar
              title={'最热'}
          />
          <ScrollableTabView
              renderTabBar={() => <ScrollableTabBar/>}
              tabBarBackgroundColor="#2196f3"
              tabBarActiveTextColor="white"
              tabBarInactiveTextColor="mintcream"
              tabBarUnderlineStyle={{backgroundColor: 'white', height: 2}}
          >
            <PopularTab tabLabel="Android"></PopularTab>
            <PopularTab tabLabel="iOS"></PopularTab>
            <PopularTab tabLabel="Java"></PopularTab>
            <PopularTab tabLabel="JavaScript"></PopularTab>
            <PopularTab tabLabel="Kotlin"></PopularTab>
          </ScrollableTabView>
        </View>
    );
  }
}

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
    let url = this.getUrl(this.props.tabLabel);
    this.dataRepository.fetchNetRepository(url)
        .then(result => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(result.items),
            isLoading: false
          });
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