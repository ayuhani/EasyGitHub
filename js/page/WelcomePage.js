import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';

export default class WelcomePage extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.props.navigator.resetTo({
        component: HomePage
      })
    }, 2000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View>
        <NavigationBar
            title={'欢迎'}
            style={{backgroundColor: 'green'}}
            statusBar={{backgroundColor: 'green'}}
        />
        <Text>欢迎欢迎{'\n'}热烈欢迎</Text>
      </View>
    );
  }
}