import {
  AsyncStorage
} from 'react-native';
import GitHubTrending from 'GitHubTrending';

export var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending', flag_my: 'my'};

export default class DataRepository {

  constructor(flag) {
    this.flag = flag;
    if (this.flag === FLAG_STORAGE.flag_trending) {
      this.trending = new GitHubTrending();
    }
  }

  fetchRepository(url) {
    return new Promise((resolve, reject) => {
      //首先获取本地的数据
      this.fetchLocalRepository(url)
          .then(result => {
            if (result) {
              resolve(result);
            } else {
              this.fetchNetRepository(url)
                  .then(result => {
                    resolve(result);
                  })
                  .catch(error => {
                    reject(error);
                  })
            }
          })
          .catch(error => {
            this.fetchNetRepository(url)
                .then(result => {
                  resolve(result);
                })
                .catch(error => {
                  reject(error);
                })
          })
    })
  }

  /**
   * 获取本地数据
   * @param url
   */
  fetchLocalRepository(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result)); // 本地获取的是个object
          } catch (e) {
            reject(e);
          }
        } else {
          reject(error);
        }
      })
    })
  }


  /**
   * 获取网络数据，返回json格式数据
   * @param url
   * @returns {Promise}
   */
  fetchNetRepository(url) {
    return new Promise((resolve, reject) => {
      if (this.flag === FLAG_STORAGE.flag_trending) {
        this.trending.fetchTrending(url)
            .then(result => {
              if (!result) {
                reject(new Error('responseData is null'));
                return;
              }
              resolve(result);
              this.saveRepository(url, result);
            })
      } else {
        fetch(url)
            .then(response => response.json())
            .then(result => {
              if (this.flag === FLAG_STORAGE.flag_my && result) {// 关于
                resolve(result);
                this.saveRepository(url, result);
              } else if (result && result.items) { //最热
                resolve(result.items); // 直接网络获取返回的是个数组
                this.saveRepository(url, result.items);
              }else {
                reject(new Error('responseData is null'));
              }
            })
            .catch(error => {
              reject(error);
            })
      }
    })
  }

  /**
   * 保存到本地
   * @param url
   * @param array
   */
  saveRepository(url, items, callBack) {
    if (!url || !items) {
      return;
    }
    let wrapData = {items: items, update_date: new Date().getTime()};
    AsyncStorage.setItem(url, JSON.stringify(wrapData), callBack);
  }

}