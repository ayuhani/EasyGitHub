import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Text,
  Image,
  Alert
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import ArrayUtil from '../../util/ArrayUtil';
import ViewUtil from '../../util/ViewUtil';
import SortableListView from 'react-native-sortable-listview';
import makeCancelable from '../../util/Cancelable';

export default class SortKeyPage extends Component {

  constructor(props) {
    super(props);
    this.dataArray = []; // 本地存储的原始key的数组
    this.sortResultArray = []; //排序之后的所有key的数组
    this.originalCheckedArray = []; // 排序之前的已订阅key的数组
    this.state = {
      checkedArray: [] // 需要进行排序操作的已订阅key的数组
    }
    this.languageDao = new LanguageDao(this.props.flag);
  }

  // 装载完成之后读取所有的标签
  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {
    this.cancelable && this.cancelable.cancel();
  }

  // 读取本地的所有标签
  loadData() {
    this.cancelable = makeCancelable(this.languageDao.fetch());
    this.cancelable.promise
        .then((result) => { // json数组
          this.getCheckedKeys(result);
        })
        .catch((error) => {

        })
  }

  // 获取排序之前的数组
  getCheckedKeys(result) {
    this.dataArray = result; // 获取本地存储的原始key的数组
    let checkedArray = [];
    for (let i = 0; i < this.dataArray.length; i++) {
      let data = this.dataArray[i];
      if (data.checked) {
        checkedArray.push(data);
      }
    }
    this.setState({
      checkedArray: checkedArray // 获取到了已订阅key的数组，由于要在这个数组进行排序操作
    })
    // 所以需要复制出来一份用来以后用作对比
    this.originalCheckedArray = ArrayUtil.cloneArray(this.state.checkedArray);
  }

  onBack() {
    // 如果两个元素一一对应，则不保存
    if (ArrayUtil.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
      this.props.navigator.pop();
      return;
    }
    Alert.alert(
        '提示',
        '在退出之前，要保存您的修改吗？',
        [
          {text: '不需要', onPress: () => this.props.navigator.pop(), style: 'cancel'},
          {
            text: '是的', onPress: () => {
            this.onSave(true);
          }
          },
        ],
        {cancelable: false}
    )
  }

  onSave(isChecked: boolean) {
    // 如果两个元素一一对应，则不保存
    if (!isChecked && ArrayUtil.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
      this.props.navigator.pop();
      return;
    }
    this.getSortResult();
    this.languageDao.save(this.sortResultArray);
    this.props.navigator.pop();
  }

  // 获取最终排好序的所有key数组
  getSortResult() {
    this.sortResultArray = ArrayUtil.cloneArray(this.dataArray);
    for (let i = 0; i < this.originalCheckedArray.length; i++) {
      let item = this.originalCheckedArray[i];
      let index = this.dataArray.indexOf(item);
      this.sortResultArray.splice(index, 1, this.state.checkedArray[i]);
    }
  }

  render() {
    let rightButton = <TouchableOpacity
        onPress={() => {
          this.onSave(false);
        }}
    >
      <View>
        <Text style={styles.title}>保存</Text>
      </View>
    </TouchableOpacity>;
    let title = this.props.flag === FLAG_LANGUAGE.flag_key ? '标签排序' : '语言排序';
    return (
        <View style={{flex: 1}}>
          <NavigationBar
              title={title}
              leftButton={ViewUtil.getLeftButton(() => {
                this.onBack();
              })}
              rightButton={rightButton}
          />
          <SortableListView
              style={{flex: 1}}
              data={this.state.checkedArray}
              // order={Object.keys(this.state.checkedArray)}
              onRowMoved={e => {
                this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
                this.forceUpdate()
              }}
              renderRow={row => <SortItem data={row}/>}
          />
        </View>
    );
  }
}

class SortItem extends Component {
  render() {
    return (
        <TouchableHighlight
            underlayColor={'#eee'}
            style={styles.item}
            {...this.props.sortHandlers}
        >
          <View style={styles.row}>
            <Text style={{flex: 1}}>{this.props.data.name}</Text>
            <Image style={styles.img} source={require('./img/ic_sort.png')}/>
          </View>
        </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: 'white',
    padding: 8
  },
  item: {
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  img: {
    width: 24,
    height: 24,
    tintColor: '#2196f3'
  }
})
