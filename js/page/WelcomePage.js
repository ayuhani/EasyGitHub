import React, {Component} from 'react';
import {
  View,
  Text
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';
import ThemeDao from '../expand/dao/ThemeDao';

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
      this.props.navigator.resetTo({
        component: HomePage,
        params: {
          theme: this.theme,
        }
      })
    }, 1000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
        <View>
          <NavigationBar
              title={'欢迎'}
              style={{backgroundColor: 'green'}}
              statusBar={{backgroundColor: 'green'}}
          />
          <Text>欢迎欢迎{'\n'}热烈欢迎</Text>
        </View>
    );
  }
}