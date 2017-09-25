import React from 'react';
import {
  Image,
  TouchableOpacity
} from 'react-native';

export default class ViewUtil {
  static getLeftButton(callBack) {
    return (
        <TouchableOpacity
            onPress={callBack}
        >
          <Image
              style={{width: 24, height: 24, margin: 8}}
              source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
        </TouchableOpacity>
    )
  }
}