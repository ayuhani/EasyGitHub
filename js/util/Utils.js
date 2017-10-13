export default class Utils {

  /**
   * 检查该item 有没有被收藏过
   * @param item
   * @param keys
   * @returns {boolean}
   */
  static checkFavorite(item, keys) {
    for (let i = 0; i < keys.length; i++) {
      let key = item.id ? item.id.toString() : item.fullName;
      if (key === keys[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * 检查缓存是否过期，默认6个小时
   * @param longTime
   * @returns {boolean} true 没有过时
   */
  static checkDate(longTime) {
    let cDate = new Date();
    let tDate = new Date();
    tDate.setTime(longTime);
    if (cDate.getYear() !== tDate.getYear()) return false;
    if (cDate.getMonth() !== tDate.getMonth()) return false;
    if (cDate.getDay() !== tDate.getDay()) return false;
    if (cDate.getHours() - tDate.getHours() > 6) return false;
    return true;
  }
}