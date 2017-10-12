import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtil from '../../util/ViewUtil';

export var FLAG_ABOUT = {flag_about: 'about', flag_about_author: 'about_author'};

export default class AboutCommon {
  constructor(props, updateState, flag) {
    this.props = props;
    this.updateState = updateState;
    this.flag = flag;
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

  render(params, contentView) {
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