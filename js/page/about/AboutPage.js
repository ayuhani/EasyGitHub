import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Linking
} from 'react-native';
import ViewUtil from '../../util/ViewUtil';
import GlobalStyle from '../../../res/styles/GlobalStyle';
import {MORE_MENU} from '../../common/MoreMenu';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import WebPage from '../WebPage';
import configs from '../../../res/data/config.json';
import AboutAuthorPage from './AboutAuthorPage';

export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.aboutCommon = new AboutCommon(props, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about, configs);
    this.state = {
      projectModels: [],
      theme: this.props.theme
    };
  }

  componentDidMount() {
    this.aboutCommon.loadData();
  }

  updateState(dic) {
    this.setState(dic);
  }

  onClick(tab) {
    let TargetComponent, params = {...this.props, menuType: tab}
    switch (tab) {
      case MORE_MENU.website:
        TargetComponent = WebPage;
        params.url = 'http://www.devio.org/io/GitHubPopular/';
        params.title = 'GitHub Popular';
        break;
      case MORE_MENU.about_author:
        TargetComponent = AboutAuthorPage;
        break;
      case MORE_MENU.feedback:
        var url = 'mailto:crazycodebo@gmail.com'
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url);
          } else {
            return Linking.openURL(url);
          }
        }).catch(err => console.error('An error occurred', err));
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
    return ViewUtil.getSettingItem(() => this.onClick(tag), icon, text, this.state.theme.styles.tabBarSelectedIcon, rightIcon);
  }

  render() {
    let contentView = <View>
      {this.aboutCommon.renderRepository(this.state.projectModels)}
      <View style={GlobalStyle.line}/>
      {this.getItem(MORE_MENU.website, require('../../../res/images/ic_computer.png'), '主页')}
      <View style={GlobalStyle.line}/>
      {this.getItem(MORE_MENU.about_author, require('../my/img/ic_insert_emoticon.png'), '关于作者')}
      <View style={GlobalStyle.line}/>
      {this.getItem(MORE_MENU.feedback, require('../../../res/images/ic_feedback.png'), '反馈')}
      <View style={GlobalStyle.line}/>
    </View>;
    return this.aboutCommon.render({
      name: 'Easy GitHub',
      description: '这是一个用来查看GitHub最受欢迎与最热项目的App，它基于React Native支持Android和iOS双平台。',
      avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508396002&di=2912065e9d70fd8c80' +
      '2dc1303408ca1e&imgtype=jpg&er=1&src=http%3A%2F%2Fimage.game.uc.cn%2F2014%2F1%2F20%2F9608385.jpg',
      backgroundImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1507801363216&di=4f0393' +
      'b91dc56a9c38f6968adc9c1bdd&imgtype=0&src=http%3A%2F%2Ffile06.16sucai.com%2F2016%2F0321%2F100d2bf327a0ce4e6d7' +
      '4e43e1db7ec92.jpg',
    }, contentView);
  }
}

const styles = StyleSheet.create({
  tintColor: {
    tintColor: "#2196f3"
  }
});