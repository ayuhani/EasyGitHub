import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Clipboard,
  Linking
} from 'react-native';
import ViewUtil from '../../util/ViewUtil';
import GlobalStyle from '../../../res/styles/GlobalStyle';
import {INFO} from '../../common/MoreMenu';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import WebPage from '../WebPage';
import configs from '../../../res/data/config.json';
import Toast, {DURATION} from 'react-native-easy-toast';

export default class AboutAuthorPage extends Component {
  constructor(props) {
    super(props);
    this.aboutCommon = new AboutCommon(props, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about_author, configs);
    this.state = {
      projectModels: [],
      author: configs.author,
      showRepository: false,
      showBlog: false,
      showQQ: false,
      showContact: false,
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
      case INFO.BLOG:
        this.updateState({showBlog: !this.state.showBlog})
        break;
      case INFO.REPOSITORY:
        this.updateState({showRepository: !this.state.showRepository})
        break;
      case INFO.QQ:
        this.updateState({showQQ: !this.state.showQQ})
        break;
      case INFO.CONTACT:
        this.updateState({showContact: !this.state.showContact})
        break;
      case INFO.BLOG.items.PERSONAL_BLOG:
      case INFO.BLOG.items.CSDN:
      case INFO.BLOG.items.JIANSHU:
      case INFO.BLOG.items.GITHUB:
        TargetComponent = WebPage;
        params.url = tab.url;
        params.title = tab.title;
        break;
      case INFO.QQ.items.MD:
        Clipboard.setString(tab.account);
        this.toast.show('群号：' + tab.account + " 已复制到剪切板", DURATION.LENGTH_LONG);
        break;
      case INFO.QQ.items.RN:
        Clipboard.setString(tab.account);
        this.toast.show('群号：' + tab.account + " 已复制到剪切板", DURATION.LENGTH_LONG);
        break;
      case INFO.CONTACT.items.QQ:
        Clipboard.setString(tab.account);
        this.toast.show('QQ：' + tab.account + " 已复制到剪切板", DURATION.LENGTH_LONG);
        break;
      case INFO.CONTACT.items.Email:
        let url = 'mailto:' + tab.account;
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

  getRow(tag, icon, text, rightIcon) {
    return ViewUtil.getSettingItem(() => this.onClick(tag), icon, text, this.props.theme.styles.tabBarSelectedIcon, rightIcon);
  }

  /**
   * 判断右侧图标
   */
  getRightIcon(isShow) {
    return isShow ? require('../../../res/images/ic_tiaozhuan_up.png') :
        require('../../../res/images/ic_tiaozhuan_down.png');
  }

  /**
   * 渲染行
   * @param dic
   * @param isShowAccount
   * @returns {*}
   */
  renderItems(dic, isShowAccount) {
    if (!dic) {
      return null;
    }
    let views = [];
    for (let i in dic) {
      let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
      views.push(
          <View key={i}>
            {this.getRow(dic[i], null, title)}
            <View style={GlobalStyle.line}/>
          </View>
      )
    }
    return views;
  }


  render() {
    let contentView = <View>
      {this.getRow(INFO.BLOG, require('../../../res/images/ic_computer.png'), INFO.BLOG.name,
          this.getRightIcon(this.state.showBlog))}
      <View style={GlobalStyle.line}/>
      {this.state.showBlog ? this.renderItems(INFO.BLOG.items, false) : null}

      {this.getRow(INFO.REPOSITORY, require('../../../res/images/ic_code.png'), INFO.REPOSITORY,
          this.getRightIcon(this.state.showRepository))}
      <View style={GlobalStyle.line}/>
      {this.state.showRepository ? this.aboutCommon.renderRepository(this.state.projectModels) : null}

      {this.getRow(INFO.QQ, require('../../../res/images/ic_computer.png'), INFO.QQ.name,
          this.getRightIcon(this.state.showQQ))}
      <View style={GlobalStyle.line}/>
      {this.state.showQQ ? this.renderItems(INFO.QQ.items, true) : null}

      {this.getRow(INFO.CONTACT, require('../../../res/images/ic_contacts.png'), INFO.CONTACT.name,
          this.getRightIcon(this.state.showContact))}
      <View style={GlobalStyle.line}/>
      {this.state.showContact ? this.renderItems(INFO.CONTACT.items, true) : null}
    </View>;
    return <View style={styles.container}>
      {this.aboutCommon.render(this.state.author, contentView)}
      <Toast ref={toast => this.toast = toast}/>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tintColor: {
    tintColor: "#2196f3"
  }
});