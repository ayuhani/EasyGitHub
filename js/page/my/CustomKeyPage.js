import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import NavigationBar from '../../common/NavigatorBar';
import ViewUtil from '../../util/ViewUtil';

export default class CustomKeyPage extends Component {

  onSave() {
    this.props.navigator.pop();
  }

  render() {
    let rightButton = <TouchableOpacity
        onPress={() => {
          this.onSave();
        }}
    >
      <View>
        <Text style={styles.title}>保存</Text>
      </View>
    </TouchableOpacity>;
    return (
        <View>
          <NavigationBar
              title={'自定义标签'}
              leftButton={ViewUtil.getLeftButton(() => {
                this.onSave();
              })}
              rightButton={rightButton}
          />
          <Text>自定义标签</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: 'white',
    padding: 8
  }
})