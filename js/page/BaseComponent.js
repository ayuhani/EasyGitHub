/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  DeviceEventEmitter
} from 'react-native';
import {ACTION_HOME} from './HomePage';

export default class BaseComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: this.props.theme,
    };
  }

  componentDidMount() {
    this.baseListener = DeviceEventEmitter.addListener(ACTION_HOME.BASE, (action, params) => this.onBaseAction(action, params));
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

  componentWillUnmount() {
    this.baseListener && this.baseListener.remove();
  }

}


