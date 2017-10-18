import {
  AsyncStorage
} from 'react-native';
import ThemeFactory, {ThemeFlags} from '../../../res/styles/ThemeFactory'

const THEME_KEY = 'theme_key';

export default class ThemeDao {

  getTheme() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          result = ThemeFlags.Default;
          this.save(result);
        }
        resolve(ThemeFactory.createTheme(result))
      })
    })
  }

  /**
   * 保存主题标识
   * @param themeFlag
   */
  save(themeColor) {
    AsyncStorage.setItem(THEME_KEY, themeColor, (error => {
    }))
  }
}