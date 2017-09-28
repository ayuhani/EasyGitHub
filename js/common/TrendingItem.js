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
  render() {
    let data = this.props.rowData;
    let description = '<p>' + data.description + '</p>';
    return <TouchableOpacity
        style={styles.container}
        onPress={this.props.onItemClick}
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
          <Image
              style={{width: 24, height: 24}}
              source={require('../../res/images/ic_star.png')}/>
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