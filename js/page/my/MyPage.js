import React, {Component} from 'react';
import {
  View,
  Text
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import CustomKeyPage from './CustomKeyPage';
import SortKeyPage from './SortKeyPage';
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';

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
                  params: {
                    ...this.props,
                    flag: FLAG_LANGUAGE.flag_key
                  }
                })
              }}>自定义标签</Text>
          <Text
              style={{margin: 16}}
              onPress={() => {
                this.props.navigator.push({
                  component: SortKeyPage,
                  params: {
                    ...this.props,
                    flag: FLAG_LANGUAGE.flag_key
                  }
                })
              }}>标签排序</Text>
          <Text
              style={{margin: 16}}
              onPress={() => {
                this.props.navigator.push({
                  component: CustomKeyPage,
                  params: {
                    ...this.props,
                    isRemoveKey: true,
                    flag: FLAG_LANGUAGE.flag_key
                  }
                })
              }}>移除标签</Text>
          <Text
              style={{margin: 16}}
              onPress={() => {
                this.props.navigator.push({
                  component: CustomKeyPage,
                  params: {
                    ...this.props,
                    flag: FLAG_LANGUAGE.flag_language
                  }
                })
              }}>自定义语言</Text>
          <Text
              style={{margin: 16}}
              onPress={() => {
                this.props.navigator.push({
                  component: SortKeyPage,
                  params: {
                    ...this.props,
                    flag: FLAG_LANGUAGE.flag_language
                  }
                })
              }}>语言排序</Text>
        </View>
    );
  }
}