import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

export default class ViewUtil {

  /**
   * titlebar的左边按钮
   * @param callBack
   * @returns {XML}
   */
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

  /**
   * 获取设置页的item
   * @param callBack 点击回调
   * @param icon 左边的小图标
   * @param text 显示文本
   * @param tintStyle 图标颜色
   * @param rightIcon 右侧图标
   */
  static getSettingItem(callBack, icon, text, tintStyle, rightIcon) {
    return <TouchableHighlight
        onPress={callBack}
    >
      <View style={styles.item}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
              style={[tintStyle, {width: 24, height: 24, marginRight: 8, marginLeft: 3}]}
              resizeMode={'stretch'}
              source={icon}/>
          <Text>{text}</Text>
        </View>
        <Image
            style={[styles.tiaoZhuan, tintStyle]}
            source={rightIcon ? rightIcon : require('../../res/images/ic_tiaozhuan.png')}/>
      </View>
    </TouchableHighlight>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  tintColor: {
    tintColor: '#2196f3'
  },
  tiaoZhuan: {
    width: 24,
    height: 24,
    tintColor: '#2196f3'
  }
})