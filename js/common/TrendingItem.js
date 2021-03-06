import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import HTMLView from 'react-native-htmlview';

export default class TrendingItem extends Component {

  constructor(props) {
    super(props);
    let isFavorite = this.props.projectModel.isFavorite;
    this.state = {
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') :
          require('../../res/images/ic_unstar_transparent.png')
    };
  }

  // 重绘
  componentWillReceiveProps(nextProps) { // 当从当前页面切换走，再切换回来后
    this.setFavoriteState(nextProps.projectModel.isFavorite);
  }

  // 按下收藏按钮触发的事件
  onPressFavorite() {
    let isFavorite = !this.state.isFavorite;
    this.setFavoriteState(isFavorite); // 让当前按钮状态改变
    this.props.projectModel.isFavorite = isFavorite; // 改变projectModel.isFavorite，进入详情就能传入最新值
    this.props.onFavorite(this.props.projectModel.rowData, isFavorite);
  }

  setFavoriteState(isFavorite) {
    this.setState({
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? require('../../res/images/ic_star.png')
          : require('../../res/images/ic_unstar_transparent.png')
    })
  }

  render() {
    let data = this.props.projectModel.rowData;
    let description = '<p>' + data.description + '</p>';
    let favoriteButton = <TouchableOpacity
        onPress={() => this.onPressFavorite()}
    >
      <Image
          style={[{width: 24, height: 24}, this.props.theme.styles.tabBarSelectedIcon]}
          source={this.state.favoriteIcon}/>
    </TouchableOpacity>;
    return <TouchableOpacity
        style={styles.container}
        onPress={() => this.props.onItemClick()}
    >
      <View style={styles.item_container}>
        <Text style={styles.title}>{data.fullName}</Text>
        <HTMLView
            value={description}
            stylesheet={{
              p: styles.description,
              a: styles.description
            }}/>
        <Text style={{marginBottom: 2}}>{data.meta}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Built by </Text>
          <View style={{flexDirection: 'row', flex: 1}}>
            {data.contributors.map((result, i, arr) => {
              return <Image
                  key={i}
                  style={{width: 24, height: 24, margin: 1}}
                  source={{uri: arr[i]}}/>
            })}
          </View>
          {favoriteButton}
        </View>
      </View>
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 18,
    marginBottom: 2,
    color: 'black'
  },
  description: {
    fontSize: 16,
    marginBottom: 2,
    color: '#757575',
  },
  item_container: {
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    elevation: 2
  }
})