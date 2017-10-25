/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  DeviceEventEmitter,
  BackHandler
} from 'react-native';
import {ACTION_HOME} from './HomePage';
import BackPressCommon from '../common/BackPressCommon';


export default class BaseComponent extends Component {
  constructor(props) {
    super(props);
    this.backPressCommon = new BackPressCommon({backPress: (e) => this.onBackPress(e)})
    this.state = {
      theme: this.props.theme,
    };
  }

  onBackPress(e) {
    BackHandler.exitApp();
    return true;
  }

  componentDidMount() {
    this.baseListener = DeviceEventEmitter.addListener(ACTION_HOME.BASE, (action, params) => this.onBaseAction(action, params));
    this.backPressCommon.componentDidMount()
  }

  componentWillUnmount() {
    this.baseListener && this.baseListener.remove();
    this.backPressCommon.componentWillUnmount()
  }

  /**
   * 通知事件回调处理
   * @param action
   * @param params
   */
  onBaseAction(action, params) {
    switch (action) {
      case ACTION_HOME.CHANGE_THEME:
        this.onThemeChange(params.theme)
        break;
      default:
        break;
    }
  }

  /**
   * 当主题改变之后更新主题
   * @param theme
   */
  onThemeChange(theme) {
    if (!theme) {
      return;
    }
    this.setState({
      theme: theme
    })
  }

}


