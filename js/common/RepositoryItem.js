import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

export default class RepositoryItem extends Component {
  render() {
    return <TouchableOpacity style={styles.container}>
      <View style={styles.item_container}>
        <Text style={styles.title}>{this.props.rowData.full_name}</Text>
        <Text style={styles.description}>{this.props.rowData.description}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>Author:</Text>
            <Image
                style={{width: 24, height: 24}}
                source={{uri: this.props.rowData.owner.avatar_url}}/>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>Stars:</Text>
            <Text>{this.props.rowData.stargazers_count}</Text>
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