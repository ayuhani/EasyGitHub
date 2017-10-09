import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

export default class PopularItem extends Component {

  constructor(props) {
    super(props);
    let isFavorite = this.props.projectModel.isFavorite;
    this.state = {
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') :
          require('../../res/images/ic_unstar_transparent.png')
    };
  }

  setFavoriteState(isFavorite) {
    this.setState({
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? require('../../res/images/ic_star.png')
          : require('../../res/images/ic_unstar_transparent.png')
    })
  }

  // 重绘
  // componentWillReceiveProps(nextProps) {
  //   this.setFavoriteState(nextProps.projectModel.isFavorite);
  // }

  // 按下收藏按钮触发的事件
  onPressFavorite() {
    let isFavorite = !this.state.isFavorite;
    this.setFavoriteState(isFavorite);
    this.props.onFavorite(this.props.projectModel.rowData, isFavorite);
  }

  render() {
    let data = this.props.projectModel.rowData;
    let favoriteButton = <TouchableOpacity
        onPress={() => this.onPressFavorite()}
    >
      <Image
          style={{width: 24, height: 24, tintColor: '#2196F3'}}
          source={this.state.favoriteIcon}/>
    </TouchableOpacity>;
    return <TouchableOpacity
        style={styles.container}
        onPress={this.props.onItemClick}
    >
      <View style={styles.item_container}>
        <Text style={styles.title}>{data.full_name}</Text>
        <Text style={styles.description}>{data.description}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>Author: </Text>
            <Image
                style={{width: 24, height: 24}}
                source={{uri: data.owner.avatar_url}}/>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>Stars:</Text>
            <Text>{data.stargazers_count}</Text>
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