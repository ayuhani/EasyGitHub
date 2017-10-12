import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  Image
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import CustomKeyPage from './CustomKeyPage';
import SortKeyPage from './SortKeyPage';
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import {MORE_MENU} from "../../common/MoreMenu";
import GlobalStyle from '../../../res/styles/GlobalStyle';
import ViewUtil from '../../util/ViewUtil';

export default class MyPage extends Component {

  onClick(tab) {
    let TargetComponent, params = {...this.props, menuType: tab}
    switch (tab) {
      case MORE_MENU.custom_language:
        TargetComponent = CustomKeyPage;
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.sort_language:
        TargetComponent = SortKeyPage;
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.custom_key:
        TargetComponent = CustomKeyPage;
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.sort_key:
        TargetComponent = SortKeyPage;
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.remove_key:
        TargetComponent = CustomKeyPage;
        params.flag = FLAG_LANGUAGE.flag_key;
        params.isRemoveKey = true;
        break;
      case MORE_MENU.custom_theme:
        break;
      case MORE_MENU.about_author:
        break;
      case MORE_MENU.about:
        break;
    }
    if (TargetComponent) {
      this.props.navigator.push({
        component: TargetComponent,
        params: params
      })
    }
  }

  getItem(tag, icon, text, rightIcon) {
    return ViewUtil.getSettingItem(() => this.onClick(tag), icon, text, styles.tintColor, rightIcon);
  }

  render() {
    var navigationBar = <NavigationBar
        title='我的'
    />
    return (
        <View style={GlobalStyle.root_container}>
          {navigationBar}
          <ScrollView>
            <TouchableHighlight onPress={() => this.onClick(MORE_MENU.about)}>
              <View style={styles.item}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                      style={[styles.tintColor, {width: 56, height: 56, marginRight: 8}]}
                      source={require('../../../res/images/ic_trending.png')}/>
                  <Text>Easy Github</Text>
                </View>
                <Image
                    style={[styles.tiaoZhuan, styles.tintColor]}
                    source={require('../../../res/images/ic_tiaozhuan.png')}/>
              </View>
            </TouchableHighlight>
            <View style={GlobalStyle.line}/>
            {/*趋势管理*/}
            <Text style={styles.groupTitle}>趋势管理</Text>
            <View style={GlobalStyle.line}/>
            {this.getItem(MORE_MENU.custom_language, require('./img/ic_custom_language.png'), '自定义语言')}
            <View style={GlobalStyle.line}/>
            {this.getItem(MORE_MENU.sort_language, require('./img/ic_swap_vert.png'), '语言排序')}
            <View style={GlobalStyle.line}/>
            <Text style={styles.groupTitle}>标签管理</Text>
            <View style={GlobalStyle.line}/>
            {this.getItem(MORE_MENU.custom_key, require('./img/ic_custom_language.png'), '自定义标签')}
            <View style={GlobalStyle.line}/>
            {this.getItem(MORE_MENU.sort_key, require('./img/ic_swap_vert.png'), '标签排序')}
            <View style={GlobalStyle.line}/>
            {this.getItem(MORE_MENU.remove_key, require('./img/ic_remove.png'), '移除标签')}
            <View style={GlobalStyle.line}/>
            <Text style={styles.groupTitle}>设置</Text>
            <View style={GlobalStyle.line}/>
            {this.getItem(MORE_MENU.custom_theme, require('./img/ic_custom_theme.png'), '自定义主题')}
            <View style={GlobalStyle.line}/>
            {this.getItem(MORE_MENU.about_author, require('./img/ic_insert_emoticon.png'), '关于作者')}
            <View style={GlobalStyle.line}/>
            {this.getItem(MORE_MENU.about, require('./img/ic_insert_emoticon.png'), '关于')}

          </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  tintColor: {
    tintColor: '#2196f3'
  },
  tiaoZhuan: {
    width: 24,
    height: 24,
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 8,
    marginBottom: 6,
    fontSize: 12,
    color: 'gray'
  }

})