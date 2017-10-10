import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  WebView,
  TextInput,
  DeviceEventEmitter,
  Image,
  TouchableOpacity
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';

const TRENDING_URL = 'https://www.github.com/';

export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props);
    this.url = this.props.projectModel.rowData.html_url ? this.props.projectModel.rowData.html_url : TRENDING_URL + this.props.projectModel.rowData.fullName;
    this.favoriteDao = new FavoriteDao(this.props.flag);
    this.state = {
      canGoBack: false,
      title: this.props.projectModel.rowData.full_name ? this.props.projectModel.rowData.full_name : this.props.projectModel.rowData.fullName,
      isFavorite: this.props.projectModel.isFavorite,
      favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') :
          require('../../res/images/ic_star_navbar.png')
    }
  }

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack,
      //title: navState.title
    })
  }

  goBack() {
    if (this.state.canGoBack) {
      return;
      this.webView.goBack();
    }
    this.props.navigator.pop();
  }

  // 点击收藏按钮
  onFavoritePress() {
    let item = this.props.projectModel.rowData;
    let isFavorite = !this.state.isFavorite;
    this.setFavoriteState(isFavorite);
    let key = item.id ? item.id.toString() : item.fullName;
    if (isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }

  setFavoriteState(isFavorite) {
    this.props.projectModel.isFavorite = isFavorite;
    this.setState({
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? require('../../res/images/ic_star.png')
          : require('../../res/images/ic_star_navbar.png')
    })
  }

  renderRightButton() {
    return <TouchableOpacity
        onPress={() => {
          this.onFavoritePress()
        }}
    >
      <Image
          style={{width: 24, height: 24, margin: 8}}
          source={this.state.favoriteIcon}/>
    </TouchableOpacity>
  }

  render() {
    return (
        <View style={styles.container}>
          <NavigationBar
              title={this.state.title}
              leftButton={ViewUtil.getLeftButton(() => this.goBack())}
              rightButton={this.renderRightButton()}
          />
          <WebView
              ref={webView => this.webView = webView}
              style={{flex: 1}}
              source={{uri: this.url}}
              onNavigationStateChange={this.onNavigationStateChange}
              startInLoadingState={true}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row'
  },
  text: {
    fontSize: 20,
    margin: 8
  }
})