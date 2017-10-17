import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';
import PropTypes from 'prop-types';
import CustomKeyPage from '../page/my/CustomKeyPage';
import SortKeyPage from '../page/my/SortKeyPage';
import AboutPage from '../page/about/AboutPage';
import AboutAuthorPage from '../page/about/AboutAuthorPage';
import Popover from './Popover';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

/**
 * 更多菜单
 */
export const MORE_MENU = {
  custom_language: '自定义语言',
  sort_language: '语言排序',
  custom_key: '自定义标签',
  sort_key: '标签排序',
  remove_key: '标签移除',
  about_author: '关于作者',
  about: '关于',
  custom_theme: '自定义主题',
  website: 'Website',
  feedback: '反馈',
  share: '分享',
}

export const INFO = {
  REPOSITORY: '开源项目',
  BLOG: {
    name: '技术博客',
    items: {
      PERSONAL_BLOG: {
        title: '个人博客',
        url: 'http://jiapenghui.com',
      },
      CSDN: {
        title: 'CSDN',
        url: 'http://blog.csdn.net/fengyuzhengfan',
      },
      JIANSHU: {
        title: '简书',
        url: 'http://www.jianshu.com/users/ca3943a4172a/latest_articles',
      },
      GITHUB: {
        title: 'GitHub',
        url: 'https://github.com/crazycodeboy',
      },
    }
  },
  CONTACT: {
    name: '联系方式',
    items: {
      QQ: {
        title: 'QQ',
        account: '1586866509',
      },
      Email: {
        title: 'Email',
        account: 'crazycodeboy@gmail.com',
      },
    }
  },
  QQ: {
    name: '技术交流群',
    items: {
      MD: {
        title: '移动开发者技术分享群',
        account: '335939197',
      },
      RN: {
        title: 'React Native学习交流群',
        account: '165774887',
      }
    },
  },
}

export default class MoreMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      buttonRect: {},
    }
  }

  static propTypes = {
    contentStyle: View.propTypes.style,
    menus: PropTypes.array.isRequired,
    anchorView: PropTypes.object
  }

  /**
   * 打开更多菜单
   */
  open() {
    this.showPopover();
  }

  // 弹出选择框
  showPopover() {
    if (!this.props.anchorView) return;
    let anchorView = this.props.anchorView;
    anchorView.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisible: true,
        buttonRect: {x: px, y: py, width: width, height: height}
      });
    });
  }

  // 弹窗消失
  closePopover() {
    this.setState({
      isVisible: false
    })
  }

  onMoreMenuSelected(tab) {
    this.closePopover();
    let TargetComponent, params = {...this.props}
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
        TargetComponent = AboutAuthorPage;
        break;
      case MORE_MENU.about:
        TargetComponent = AboutPage;
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
      case MORE_MENU.share:
        break;
    }
    if (TargetComponent) {
      this.props.navigator.push({
        component: TargetComponent,
        params: params
      })
    }
  }

  renderMoreMenu() {
    return <Popover
        contentStyle={{backgroundColor: '#343434', opacity: 0.9}}
        isVisible={this.state.isVisible}
        fromRect={this.state.buttonRect}
        placement="bottom"
        contentMarginRight={8}
        onClose={() => this.closePopover()}>
      {this.props.menus.map((result, i, arr) => {
        return <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            key={i}
            onPress={() => this.onMoreMenuSelected(arr[i])}
        >
          <Text
              style={{fontSize: 18, color: 'white', padding: 5}}
          >{arr[i]}</Text>
        </TouchableOpacity>
      })}
    </Popover>;
  }

  render() {
    return this.renderMoreMenu();
  }
}