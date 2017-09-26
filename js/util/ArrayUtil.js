export default class ArrayUtil {

  /**
   * 更新数组，若item已存在则从数组中移除，否则添加进数组
   * @param callBack
   */
  static updateArray(array, item) {
    for (var i = 0; i < array.length; i++) {
      var temp = array[i];
      if (temp === item) {
        array.splice(i, 1);
        return;
      }
    }
    array.push(item);
  }
}