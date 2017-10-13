import {AsyncStorage} from 'react-native';
import DataRepository, {FLAG_STORAGE} from './DataRepository';
import Utils from '../../util/Utils';

var itemMap = new Map();

export default class RepositoryUtil {
  constructor(aboutCommon) {
    this.aboutCommon = aboutCommon;
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_my);
  }

  /**
   * 更新数据
   * @param k
   * @param v
   */
  updateData(k, v) {
    itemMap.set(k, v);
    var arr = [];
    for (var value of itemMap.values()) {
      arr.push(value);
    }
    this.aboutCommon.onNotifyDataChanged(arr);
  }

  /**
   * 获取指定url下的数据
   * @param url
   */
  fetchRepository(url) {
    this.dataRepository.fetchRepository(url)
        .then(result => {
          this.item = result && result.items ? result.items : result ? result : [];
          this.updateData(url, this.item);
          if (result && result.update_date && !Utils.checkDate(result.update_date)) {
            return this.dataRepository.fetchNetRepository(url);
          }
        })
        .then(item => {
          if (item) {
            this.updateData(url, item);
          }
        })
        .catch(e => {

        })
  }

  /**
   * 批量获取urls对应的数据
   * @param urls
   */
  fetchRepositories(urls) {
    for (let i = 0; i < urls.length; i++) {
      this.fetchRepository(urls[i]);
    }
  }
}