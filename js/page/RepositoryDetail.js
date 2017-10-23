import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  WebView,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import ActionUtil from '../util/ActionUtil';

const TRENDING_URL = 'https://www.github.com/';
const THEME_COLOR = '#2196f3';

export default class RepositoryDetail extends Component {

  constructor(props) {
    super(props);
    this.url = this.props.projectModel.rowData.html_url ? this.props.projectModel.rowData.html_url : TRENDING_URL + this.props.projectModel.rowData.fullName;
    this.favoriteDao = new FavoriteDao(this.props.flag);
    this.state = {
      isLoading: true,
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
      this.webView.goBack();
      return;
    }
    this.props.navigator.pop();
  }

  // 点击收藏按钮
  onFavoritePress() {
    let item = this.props.projectModel.rowData;
    let isFavorite = !this.state.isFavorite;
    this.setFavoriteState(isFavorite);
    ActionUtil.onFavorite(this.favoriteDao, item, isFavorite);
  }

  componentWillUnmount() {
    // this.props.onUpdateAfterFavorite();
  }

  setFavoriteState(isFavorite) {
    // 这句话通知上一页的item要变化,这句话效果不好，不知道为什么
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
              style={this.props.theme.styles.navBar}
              statusBar={{backgroundColor: this.props.theme.themeColor}}
              title={this.state.title}
              leftButton={ViewUtil.getLeftButton(() => this.goBack())}
              rightButton={this.renderRightButton()}
          />
          <View style={styles.container}>
            <WebView
                ref={webView => this.webView = webView}
                style={{flex: 1}}
                source={{uri: this.url}}
                onNavigationStateChange={this.onNavigationStateChange}
                onLoadEnd={() => this.setState({isLoading: false})}
                javaScriptEnabled={true}
            />
            <ActivityIndicator
                style={styles.indicator}
                animating={this.state.isLoading}
                color={this.props.theme.themeColor}
                size={'large'}
            />
          </View>
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
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
})