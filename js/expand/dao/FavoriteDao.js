import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import keys from '../../../res/data/keys.json';
import langs from '../../../res/data/langs.json';

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
  constructor(flag) {
    this.flag = flag;
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }

  /**
   * 收藏项目，保存收藏的项目
   * @param key 项目id 或者名称
   * @param value 收藏的项目
   * @param callback
   */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (error) => {
      if (!error) {
        this.updateFavoriteKeys(key, true);
      }
    })
  }

  /**
   * 更新Favorite key集合
   * @param key
   * @param isAdd true 添加；false 删除
   */
  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        var favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        var index = favoriteKeys.indexOf(key);
        if (isAdd) { // 如果我是要收藏
          if (index === -1) { // 收藏的数组里正好没有我想要收藏的
            favoriteKeys.push(key); // 那就收藏
          }
        } else { // 如果是要取消收藏
          if (index !== -1) { // 正好在收藏的数组里
            favoriteKeys.splice(index, 1); // 那就把它删了
          }
        }
        // 修改完再保存起来
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
      }
    });
  }

  /**
   * 取消收藏,移除已经收藏的项目
   * @param key
   */
  removeFavoriteItem(key) {
    AsyncStorage.setItem(key, (error) => {
      if (!error) {
        this.updateFavoriteKeys(key, false);
      }
    })
  }

  /**
   * 获取收藏的项目对应的key
   * @returns {Promise}
   */
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(error);
        }
      })
    })
  }


}