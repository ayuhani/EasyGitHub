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
import FavoriteDao from '../../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from "../../expand/dao/DataRepository";
import ProjectModel from '../../model/ProjectModel';
import Utils from '../../util/Utils';
import PopularItem from '../../common/PopularItem';
import RepositoryDetail from '../../page/RepositoryDetail';
import ReposiroryUtil from '../../expand/dao/RepositoryUtil';
import ActionUtil from '../../util/ActionUtil';

export var FLAG_ABOUT = {flag_about: 'about', flag_about_author: 'about_author'};

export default class AboutCommon {
  constructor(props, updateState, flag, configs) {
    this.props = props;
    this.updateState = updateState;
    this.flag = flag;
    this.repositories = [];
    this.favoriteKeys = null;
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_my);
    this.repositoryUtil = new ReposiroryUtil(this);
    this.configs = configs;
  }

  loadData() {
    if (this.flag === FLAG_ABOUT.flag_about) {
      // 关于页面
      console.log('一条数据')
      this.repositoryUtil.fetchRepository(this.configs.info.currentRepoUrl);
    } else {
      // 关于作者
      var urls = [];
      var items = this.configs.items;
      for (let i = 0; i < items.length; i++) {
        urls.push(this.configs.info.url + items[i]);
      }
      this.repositoryUtil.fetchRepositories(urls);
    }
  }

  /**
   * 通知数据发生改变
   * @param items 改变的数据
   */
  onNotifyDataChanged(items) {
    this.updateFavorite(items)
  }

  /**
   * 更新项目的用户收藏状态
   * @param repositories
   */
  async updateFavorite(repositories) {
    if (!repositories) {
      return;
    }
    this.repositories = repositories;
    if (!this.favoriteKeys) {
      this.favoriteKeys = await this.favoriteDao.getFavoriteKeys();
    }
    let projectModels = [];
    let items = this.repositories;
    for (let i = 0; i < items.length; i++) {
      projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i],
          this.favoriteKeys ? this.favoriteKeys : [])));
    }
    this.updateState({
      projectModels: projectModels
    })
  }

  /**
   * 创建项目视图
   * @param projectModels
   * @returns {*}
   */
  renderRepository(projectModels) {
    if (!projectModels || projectModels.length === 0) {
      return null;
    }
    let views = [];
    for (let i = 0; i < projectModels.length; i++) {
      let projectModel = projectModels[i];
      views.push(<PopularItem
          key={projectModel.rowData.id}
          projectModel={projectModel}
          onItemClick={() => ActionUtil.onItemClick({
            projectModel: projectModel,
            flag: FLAG_STORAGE.flag_my,
            onUpdateAfterFavorite: () => {
            },
            ...this.props
          })}
          onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />);
    }
    return views;
  }

  /**
   * favoriteIcon的单击回调函数
   * @param item
   * @param isFavorite
   */
  onFavorite(item, isFavorite) {
    if (isFavorite) {
      this.favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
    } else {
      this.favoriteDao.removeFavoriteItem(item.id.toString());
    }
  }

  getParallaxRenderConfig(params) {
    let config = {};
    config.renderBackground = () => (
        <View key="background">
          <Image source={{
            uri: params.backgroundImg,
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