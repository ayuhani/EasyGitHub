import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import NavigationBar from './js/common/NavigatorBar';

export default class Girl extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  renderButton(image) {
    return (
        <TouchableOpacity
            onPress={() => {
              this.props.navigator.pop();
            }}
        >
          <Image style={{width: 24, height: 24, margin: 8}} source={image}/>
        </TouchableOpacity>
    )
  }
  render() {
    return (
        <View style={styles.container}>
          <NavigationBar
              title={'Girl'}
              style={{backgroundColor: "darkcyan"}}
              statusBar={{backgroundColor: 'darkcyan'}}
              leftButton={this.renderButton(require('./res/images/ic_arrow_back_white_36pt.png'))}
              rightButton={this.renderButton(require('./res/images/ic_star.png'))}
          />
          <Text style={styles.text}>I am a girl</Text>
          <Text style={styles.text}>我收到了{this.props.word}</Text>
          <Text
              style={styles.text}
              onPress={() => {
                this.props.onCallBack('一盒巧克力');
                this.props.navigator.pop();
              }}
          >回赠巧克力</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red'
  },
  text: {
    fontSize: 20,
  }
})