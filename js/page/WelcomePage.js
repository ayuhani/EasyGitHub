import React, {Component} from 'react';
import {
  View,
  Text
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';
import ThemeDao from '../expand/dao/ThemeDao';
import SplashScreen from 'react-native-splash-screen';

export default class WelcomePage extends Component {

  constructor(props) {
    super(props);
    this.themeDao = new ThemeDao();
  }

  componentDidMount() {
    this.themeDao.getTheme()
        .then(data => {
          this.theme = data;
        })
        .catch(e => {

        });
    this.timer = setTimeout(() => {
      SplashScreen.hide();
      this.props.navigator.resetTo({
        component: HomePage,
        params: {
          theme: this.theme,
        }
      })
    }, 2000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return null;
  }
}