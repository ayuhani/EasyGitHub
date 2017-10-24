import {Component} from 'react';
import {
  BackHandler
} from 'react-native';

export default class BackPressCommon {
  constructor(props) {
    this.props = props;
    this._hardwareBackPress = this.onHardwareBackPress.bind(this);
  }

  componentDidMount() {
    if (this.props.backPress) {
      BackHandler.addEventListener('hardwareBackPress', this._hardwareBackPress)
    }
  }

  componentWillUnmount() {
    if (this.props.backPress) {
      BackHandler.removeEventListener('hardwareBackPress', this._hardwareBackPress)
    }
  }

  onHardwareBackPress(e) {
    return this.props.backPress(e)
  }
}
