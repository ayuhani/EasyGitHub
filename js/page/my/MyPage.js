import React, {Component} from 'react';
import {
  View,
  Text
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import CustomKeyPage from './CustomKeyPage';
import SortKeyPage from './SortKeyPage';

export default class MyPage extends Component {

  render() {
    return (
        <View>
          <NavigationBar
              title={'我的'}
          />
          <Text
              style={{margin: 16}}
              onPress={() => {
                this.props.navigator.push({
                  component: CustomKeyPage,
                  params: {...this.props}
                })
              }}>自定义标签</Text>
          <Text
              style={{margin: 16}}
              onPress={() => {
                this.props.navigator.push({
                  component: SortKeyPage,
                  params: {...this.props}
                })
              }}>标签排序</Text>
          <Text
              style={{margin: 16}}
              onPress={() => {
                this.props.navigator.push({
                  component: CustomKeyPage,
                  params: {
                    ...this.props,
                    isRemoveKey: true
                  }
                })
              }}>移除标签</Text>
        </View>
    );
  }
}