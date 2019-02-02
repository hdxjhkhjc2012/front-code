/*
 * @Description:  公共方法api
 * @Author: hdx
 * @Date: 2019-02-01 11:22:03
 * @LastEditors: hdx
 * @LastEditTime: 2019-02-02 13:59:04
 */
const api = {
    // 会员信息
    getNews: `/api/infotowx/findinfo.do?channelid=6d926ad4-8275-453b-98a7-00264c124ddf`,
    // 更新场景状态
    updateScense(obj) {
        return `/api/member/scense/update?scenseId=${obj.scenseId}&state=${obj.state}`
    }
}