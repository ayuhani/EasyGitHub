import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import NavigationBar from '../../common/NavigatorBar';
import ViewUtil from '../../util/ViewUtil';
import ArrayUtil from '../../util/ArrayUtil';
import LanuageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import CheckBox from 'react-native-check-box';

export default class CustomKeyPage extends Component {
  constructor(props) {
    super(props);
    this.languageDao = new LanuageDao(FLAG_LANGUAGE.flag_key);
    this.changeValues = [];
    this.state = {
      dataArray: []
    }
  }

  componentDidMount() {
    // 组件挂载完成，加载数据
    this.loadData();
  }

  // 加载数据，
  loadData() {
    this.languageDao.fetch()
        .then(result => {
          this.setState({
            dataArray: result // 得到的是json格式数组对象
          });
        })
        .catch(error => {
          console.log(error);
        })
  }

  // 渲染行，每行最多显示两个checkbox
  renderView() {
    if (!this.state.dataArray || this.state.dataArray.length === 0) {
      return null;
    }
    let len = this.state.dataArray.length;
    let views = [];
    for (let i = 0, l = len - 2; i < l; i += 2) {
      views.push(
          <View key={i}>
            <View style={styles.item}>
              {this.renderCheckBox(this.state.dataArray[i])}
              {this.renderCheckBox(this.state.dataArray[i + 1])}
            </View>
            <View style={styles.line}></View>
          </View>
      )
    }
    views.push(
        <View key={len - 1}>
          <View style={styles.item}>
            {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
            {this.renderCheckBox(this.state.dataArray[len - 1])}
          </View>
          <View style={styles.line}></View>
        </View>
    )
    return views;
  }

  // checkbox的点击事件
  onClick(data) {
    data.checked = !data.checked;
    ArrayUtil.updateArray(this.changeValues, data);
  }

  // 渲染checkbox
  renderCheckBox(data) {
    let leftText = data.name;
    return <CheckBox
        style={{flex: 1, padding: 10}}
        onClick={() => this.onClick(data)}
        leftText={leftText}
        checkedImage={
          <Image
              style={styles.checkbox_img}
              source={require('./img/ic_check_box.png')}/>
        }
        unCheckedImage={
          <Image
              style={styles.checkbox_img}
              source={require('./img/ic_check_box_outline_blank.png')}/>
        }
        isChecked={data.checked}/>
  }

  // 点击保存按钮
  onSave() {
    if (this.changeValues.length == 0) {
      this.props.navigator.pop();
      return;
    }
    this.languageDao.save(this.state.dataArray);
    this.props.navigator.pop();
  }

  // 点击返回按钮
  onBack() {
    if (this.changeValues.length == 0) {
      this.props.navigator.pop();
      return;
    }
    Alert.alert(
        '提示',
        '要保存修改吗？',
        [
          {text: '不保存', onPress: () => this.props.navigator.pop(), style: 'cancel'},
          {
            text: '保存', onPress: () => {
            this.languageDao.save(this.state.dataArray);
            this.props.navigator.pop()
          }
          },
        ],
        {cancelable: false}
    )
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
                this.onBack();
              })}
              rightButton={rightButton}
          />
          <ScrollView>
            {this.renderView()}
          </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: 'white',
    padding: 8
  },
  line: {
    height: 0.5,
    backgroundColor: 'gray'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox_img: {
    width: 24,
    height: 24,
    tintColor: '#2196f3'
  }
})