import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtil from '../../util/ViewUtil';
import GlobalStyle from '../../../res/styles/GlobalStyle';
import {MORE_MENU} from '../../common/MoreMenu';

export default class AboutPage extends Component {
  constructor(props) {
    super(props);
  }

  getParallaxRenderConfig(params) {
    let config = {};
    config.renderBackground = () => (
        <View key="background">
          <Image source={{
            uri: params.backgroundImage,
            width: window.width,
            height: PARALLAX_HEADER_HEIGHT
          }}/>
          <View style={{
            position: 'absolute',
            top: 0,
            width: window.width,
            backgroundColor: 'rgba(0,0,0,.4)',
            height: PARALLAX_HEADER_HEIGHT
          }}/>
        </View>
    );
    config.renderForeground = () => (
        <View key="parallax-header" style={styles.parallaxHeader}>
          <Image style={styles.avatar} source={{
            uri: params.avatar,
            width: AVATAR_SIZE,
            height: AVATAR_SIZE
          }}/>
          <Text style={styles.sectionSpeakerText}>
            {params.name}
          </Text>
          <Text style={styles.sectionTitleText}>
            {params.description}
          </Text>
        </View>
    );
    config.renderStickyHeader = () => (
        <View key="sticky-header" style={styles.stickySection}>
          <Text style={styles.stickySectionText}>{params.name}</Text>
        </View>
    );
    config.renderFixedHeader = () => (
        <View key="fixed-header" style={styles.fixedSection}>
          {ViewUtil.getLeftButton(() => {
            this.props.navigator.pop();
          })}
        </View>
    );
    return config;
  }

  renderView(params, contentView) {
    let renderConfig = this.getParallaxRenderConfig(params);
    return (
        <ParallaxScrollView
            backgroundColor="#2196f3"
            headerBackgroundColor="#333"
            stickyHeaderHeight={STICKY_HEADER_HEIGHT}
            parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
            backgroundSpeed={10}
            {...renderConfig}>

          {contentView}
        </ParallaxScrollView>
    );
  }

  onClick(tab) {
    let TargetComponent, params = {...this.props, menuType: tab}
    switch (tab) {
      case MORE_MENU.website:
        TargetComponent = CustomKeyPage;
        break;
      case MORE_MENU.about_author:
        TargetComponent = SortKeyPage;
        break;
      case MORE_MENU.feedback:
        TargetComponent = CustomKeyPage;
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
    let contentView = <View style={styles.container}>
      {this.getItem(MORE_MENU.website, require('../../../res/images/ic_computer.png'), '主页')}
      <View style={GlobalStyle.line}/>
      {this.getItem(MORE_MENU.about_author, require('../my/img/ic_insert_emoticon.png'), '关于作者')}
      <View style={GlobalStyle.line}/>
      {this.getItem(MORE_MENU.feedback, require('../../../res/images/ic_feedback.png'), '反馈')}
      <View style={GlobalStyle.line}/>
    </View>;
    return this.renderView({
      name: 'Easy GitHub',
      description: '这是一个用来查看GitHub最受欢迎与最热项目的App，它基于React Native支持Android和iOS双平台。',
      avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508396002&di=2912065e9d70fd8c80' +
      '2dc1303408ca1e&imgtype=jpg&er=1&src=http%3A%2F%2Fimage.game.uc.cn%2F2014%2F1%2F20%2F9608385.jpg',
      backgroundImage: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1507801363216&di=4f0393' +
      'b91dc56a9c38f6968adc9c1bdd&imgtype=0&src=http%3A%2F%2Ffile06.16sucai.com%2F2016%2F0321%2F100d2bf327a0ce4e6d7' +
      '4e43e1db7ec92.jpg',
    }, contentView);
  }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 100;
const PARALLAX_HEADER_HEIGHT = window.width * 0.7;
const STICKY_HEADER_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
  },
  fixedSection: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    left: 0,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 56
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 16,
    marginRight: 16,
    paddingVertical: 5
  },
  tintColor: {
    tintColor: "#2196f3"
  }
});