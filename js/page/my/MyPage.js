import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import NavigationBar from '../../common/NavigatorBar';
import CustomKeyPage from './CustomKeyPage';

export default class MyPage extends Component {

  render() {
    return (
        <View>
          <NavigationBar
              title={'我的'}
          />
          <Text onPress={() => {
            this.props.navigator.push({
              component: CustomKeyPage,
              params: {...this.props}
            })
          }}>自定义标签</Text>
        </View>
    );
  }
}