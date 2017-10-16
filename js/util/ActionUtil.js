import RepositoryDetail from '../page/RepositoryDetail';

export default class ActionUtil{

  /**
   * 跳转到详情页
   * @param params
   */
  static onItemClick(params){
    var {navigator} = params;
    navigator.push({
      component: RepositoryDetail,
      params: {
          ...params
      }
    })
  }
}