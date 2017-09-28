import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  AsyncStorage
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';
import Girl from './Girl';
import NavigationBar from './js/common/NavigationBar';

const KEY = 'text';

export default class AsyncStorageTest extends Component {
  constructor(props) {
    super(props);
  }

  onSave() {
    AsyncStorage.setItem(KEY, this.text, (error) => {
      if (!error) {
        this.toast.show('保存成功', DURATION.LENGTH_LONG);
      } else {
        this.toast.show('保存失败', DURATION.LENGTH_LONG);
      }
    })
  }

  onRemove() {
    AsyncStorage.removeItem(KEY, (error) => {
      if (!error) {
        this.toast.show('移除成功', DURATION.LENGTH_SHORT);
      } else {
        this.toast.show('移除失败', DURATION.LENGTH_SHORT);
      }
    })
  }

  onFetch() {
    AsyncStorage.getItem(KEY, (error, result) => {
      if (!error) {
        if (result !== '' && result !== null) {
          this.toast.show('取出的内容为：' + result, DURATION.LENGTH_LONG);
        } else {
          this.toast.show('取出的内容不存在', DURATION.LENGTH_SHORT);
        }
      } else {
        this.toast.show('取出失败', DURATION.LENGTH_LONG)
      }
    })
  }

  render() {
    return (
        <View style={styles.container}>
          <NavigationBar
              title={'AsyncStorageTest'}
          />
          <TextInput
              style={{height: 48}}
              onChangeText={(text) => this.text = text}
          />
          <View style={{flexDirection: 'row'}}>
            <Text
                style={{fontSize: 20, color: 'black', margin: 3}}
                onPress={() => this.onSave()}
            >保存</Text>
            <Text
                style={{fontSize: 20, color: 'black', margin: 3}}
                onPress={() => this.onRemove()}
            >移除</Text>
            <Text
                style={{fontSize: 20, color: 'black', margin: 3}}
                onPress={() => this.onFetch()}
            >读取</Text>
          </View>
          <Toast ref={(toast) => this.toast = toast}/>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
  text: {
    fontSize: 20,
  }
})