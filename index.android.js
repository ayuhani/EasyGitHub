/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import { Navigator } from 'react-native-deprecated-custom-components';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import Boy from './Boy';
import ListViewTest from './ListViewTest';
import FetchTest from './FetchTest';

export default class EasyGitHub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'tb_polular',
    };
  }
  render() {
    return (
        <View style={styles.container}>
          {/**<TabNavigator>
            <TabNavigator.Item
                selected={this.state.selectedTab === 'tb_polular'}
                title="Home"
                selectedTitleStyle={{color: 'red'}}
                renderIcon={() => <Image style={styles.bottomImage} source={require('./res/images/ic_polular.png')} />}
                renderSelectedIcon={() => <Image style={[styles.bottomImage, {tintColor: 'red'}]} source={require('./res/images/ic_polular.png')} />}
                badgeText="1"
                onPress={() => this.setState({ selectedTab: 'tb_polular' })}>
              <View style={styles.page1}></View>
            </TabNavigator.Item>
            <TabNavigator.Item
                selected={this.state.selectedTab === 'tb_trending'}
                title="Profile"
                renderIcon={() => <Image style={styles.bottomImage} source={require('./res/images/ic_trending.png')} />}
                renderSelectedIcon={() => <Image style={[styles.bottomImage, {tintColor: 'red'}]} source={require('./res/images/ic_trending.png')} />}
                onPress={() => this.setState({ selectedTab: 'tb_trending' })}>
              <View style={styles.page2}></View>
            </TabNavigator.Item>
            <TabNavigator.Item
                selected={this.state.selectedTab === 'tb_favorite'}
                title="Favorite"
                selectedTitleStyle={{color: 'red'}}
                renderIcon={() => <Image style={styles.bottomImage} source={require('./res/images/ic_polular.png')} />}
                renderSelectedIcon={() => <Image style={[styles.bottomImage, {tintColor: 'red'}]} source={require('./res/images/ic_polular.png')} />}
                badgeText="1"
                onPress={() => this.setState({ selectedTab: 'tb_favorite' })}>
              <View style={styles.page1}></View>
            </TabNavigator.Item>
            <TabNavigator.Item
                selected={this.state.selectedTab === 'tb_my'}
                title="My"
                renderIcon={() => <Image style={styles.bottomImage} source={require('./res/images/ic_trending.png')} />}
                renderSelectedIcon={() => <Image style={[styles.bottomImage, {tintColor: 'red'}]} source={require('./res/images/ic_trending.png')} />}
                onPress={() => this.setState({ selectedTab: 'tb_my' })}>
              <View style={styles.page2}></View>
            </TabNavigator.Item>
          </TabNavigator>**/}
          {/*<Navigator*/}
              {/*initialRoute={{*/}
                {/*component: Boy*/}
              {/*}}*/}
              {/*renderScene={(route, navigator) => {*/}
                {/*let Component = route.component;*/}
                {/*return <Component navigator={navigator} {...route.params}/>;*/}
              {/*}}*/}
          {/*/>*/}
          {/*<ListViewTest/>*/}
          <FetchTest/>
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

AppRegistry.registerComponent('EasyGitHub', () => EasyGitHub);
