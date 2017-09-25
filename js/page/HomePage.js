/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import PopularPage from './PopularPage';
import AsyncStorageTest from '../../AsyncStorageTest';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'tb_polular',
    };
  }
  render() {
    return (
        <View style={styles.container}>
          <TabNavigator>
           <TabNavigator.Item
           selected={this.state.selectedTab === 'tb_polular'}
           title="最热"
           selectedTitleStyle={{color: '#2196f3'}}
           renderIcon={() => <Image style={styles.bottomImage} source={require('../../res/images/ic_polular.png')} />}
           renderSelectedIcon={() => <Image style={[styles.bottomImage, {tintColor: '#2196f3'}]} source={require('../../res/images/ic_polular.png')} />}
           onPress={() => this.setState({ selectedTab: 'tb_polular' })}>
           <PopularPage/>
           </TabNavigator.Item>
           <TabNavigator.Item
           selected={this.state.selectedTab === 'tb_trending'}
           title="趋势"
           selectedTitleStyle={{color: '#2196f3'}}
           renderIcon={() => <Image style={styles.bottomImage} source={require('../../res/images/ic_trending.png')} />}
           renderSelectedIcon={() => <Image style={[styles.bottomImage, {tintColor: '#2196f3'}]} source={require('../../res/images/ic_trending.png')} />}
           onPress={() => this.setState({ selectedTab: 'tb_trending' })}>
           <AsyncStorageTest/>
           </TabNavigator.Item>
           <TabNavigator.Item
           selected={this.state.selectedTab === 'tb_favorite'}
           title="收藏"
           selectedTitleStyle={{color: '#2196f3'}}
           renderIcon={() => <Image style={styles.bottomImage} source={require('../../res/images/ic_favorite.png')} />}
           renderSelectedIcon={() => <Image style={[styles.bottomImage, {tintColor: '#2196f3'}]} source={require('../../res/images/ic_favorite.png')} />}
           onPress={() => this.setState({ selectedTab: 'tb_favorite' })}>
           <View style={styles.page1}></View>
           </TabNavigator.Item>
           <TabNavigator.Item
           selected={this.state.selectedTab === 'tb_my'}
           title="我的"
           selectedTitleStyle={{color: '#2196f3'}}
           renderIcon={() => <Image style={styles.bottomImage} source={require('../../res/images/ic_my.png')} />}
           renderSelectedIcon={() => <Image style={[styles.bottomImage, {tintColor: '#2196f3'}]} source={require('../../res/images/ic_my.png')} />}
           onPress={() => this.setState({ selectedTab: 'tb_my' })}>
           <View style={styles.page2}></View>
           </TabNavigator.Item>
           </TabNavigator>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  page1: {
    flex: 1,
    backgroundColor: 'cyan'
  },
  page2: {
    flex: 1,
    backgroundColor: 'green'
  },
  bottomImage: {
    width: 24,
    height: 24
  }
});

