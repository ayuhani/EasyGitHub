import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import keys from '../../../res/data/keys.json';
import langs from '../../../res/data/langs.json';


export var FLAG_LANGUAGE = {
  flag_language: 'flag_language_language', // 趋势
  flag_key: 'flag_language_key' // 这是处理最热标签用到的
};

export default class FavoriteDao {
  constructor(flag) {
    this.flag = flag;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, result) => {
        if (error) {
          reject(error);
        } else {
          if (result) { // 如果当前key已存在，并且不是空，返回的是json对象
            try {
              resolve(JSON.parse(result));
            } catch (e) {
              reject(e);
            }
          } else { // 如果取出的key是空的，取出默认的json文件返回
            var data = this.flag === FLAG_LANGUAGE.flag_key ? keys : langs;
            this.save(data);
            resolve(data);
          }
        }
      })
    })
  }

  save(data) {
    AsyncStorage.setItem(this.flag, JSON.stringify(data), (error) => {
      console.log(error);
    })
  }
}