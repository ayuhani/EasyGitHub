export default class Utils {

  /**
   * 检查该item 有没有被收藏过
   * @param item
   * @param keys
   * @returns {boolean}
   */
  static checkFavorite(item, keys) {
    for (let i = 0; i < keys.length; i++) {
      let id = item.id ? item.id.toString() : item.fullName;
      if (id === keys[i]) {
        return true;
      }
    }
    return false;
  }
}