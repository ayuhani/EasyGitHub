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

  /**
   * 克隆一个数组
   * @param from
   * @returns {Array}
   */
  static cloneArray(from) {
    if (!from) {
      return [];
    }
    let newArray = [];
    for (let i = 0; i < from.length; i++) {
      newArray[i] = from[i];
    }
    return newArray;
  }

  /**
   * 判断两个数组的元素是否一一对应
   * @param array1
   * @param array2
   * @returns {boolean}
   */
  static isEqual(array1, array2) {
    if (!(array1 && array2)) {
      return false;
    }
    if (array1.length !== array2.length) {
      return false;
    }
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * 移除数组指定的元素
   * @param array
   * @param item
   */
  static removeItem(array, item) {
    if (!array) {
      return;
    }
    for (let i = 0; i < array.length; i++) {
      if (item === array[i]) {
        array.splice(i, 1);
      }
    }
  }

}