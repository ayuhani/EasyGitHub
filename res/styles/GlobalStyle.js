/**
 * 全局样式
 */
import {
  Dimensions
} from 'react-native';

const {width, height} = Dimensions.get('window');

module.exports = {
  line: {
    flex: 1,
    height: 0.4,
    opacity: 0.5,
    backgroundColor: 'darkgray'
  },
  root_container: {
    flex: 1,
    backgroundColor: '#f3f3f4'
  },
  window_width: width,
  window_height: height
}