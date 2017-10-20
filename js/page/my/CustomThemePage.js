import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Modal,
  ScrollView,
  DeviceEventEmitter
} from 'react-native';
import GlobalStyle from '../../../res/styles/GlobalStyle';
import {ThemeFlags} from '../../../res/styles/ThemeFactory'
import ThemeDao from '../../expand/dao/ThemeDao';
import {ACTION_HOME} from "../HomePage";
import ThemeFactory from '../../../res/styles/ThemeFactory';

export default class CustomThemePage extends Component {

  constructor(props) {
    super(props);
    this.themeDao = new ThemeDao();
  }

  onSelectTheme(themeKey) {
    this.props.onClose();
    this.themeDao.save(ThemeFlags[themeKey]);
    DeviceEventEmitter.emit(ACTION_HOME.BASE, ACTION_HOME.CHANGE_THEME, {theme: ThemeFactory.createTheme(ThemeFlags[themeKey])})
  }

  /**
   * 创建主题item,渲染一个格子
   * @param themeKey
   * @returns {XML}
   */
  getThemeItem(themeKey) {
    return <TouchableHighlight
        style={{flex: 1}}
        underlayColor={'white'}
        onPress={() => this.onSelectTheme(themeKey)}
    >
      <View style={[{backgroundColor: ThemeFlags[themeKey]}, styles.themeItem]}>
        <Text style={{color: 'white'}}>{themeKey}</Text>
      </View>
    </TouchableHighlight>
  }

  /**
   * 渲染一行三个格子
   * @returns {Array}
   */
  renderThemeItem() {
    var views = [];
    for (let i = 0, keys = Object.keys(ThemeFlags); i < keys.length; i += 3) {
      key1 = keys[i], key2 = keys[i + 1], key3 = keys[i + 2];
      views.push(<View
          key={i}
          style={{flexDirection: 'row'}}>
        {this.getThemeItem(key1)}
        {this.getThemeItem(key2)}
        {this.getThemeItem(key3)}
      </View>)
    }
    return views;
  }

  /**
   * 渲染所有格子
   * @returns {XML}
   */
  renderContentView() {
    return <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.onClose()
        }}>
      <View style={styles.modalContainer}>
        <ScrollView>
          {this.renderThemeItem()}
        </ScrollView>
      </View>
    </Modal>
  }

  render() {
    let view = this.props.visible ? <View style={GlobalStyle.root_container}>
      {this.renderContentView()}
    </View> : null;
    return view;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modalContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 3,
    shadowColor: 'gray',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  themeItem: {
    height: 120,
    margin: 3,
    padding: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  }
})