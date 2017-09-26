import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import keys from '../../../res/data/keys.json';


export var FLAG_LANGUAGE = {
  flag_language: 'flag_language_language', //
  flag_key: 'flag_language_key' // 这是标签用到的
};

export default class LanguageDao {
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
            var data = this.flag === FLAG_LANGUAGE.flag_key ? keys : null;
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