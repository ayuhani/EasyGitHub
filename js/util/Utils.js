export default class Utils {

  /**
   * 检查该item 有没有被收藏过
   * @param item
   * @param keys
   * @returns {boolean}
   */
  static checkFavorite(item, keys) {
    for (let i = 0; i < keys.length; i++) {
      if (item.id.toString() === keys[i]) {
        return true;
      }
    }
    return false;
  }
}