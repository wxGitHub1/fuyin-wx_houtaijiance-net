import axios from '../utils/asiox';
/**
 * 
 * @param {*} params {}
 * baseUrl  接口路径
 */
// const baseUrl  = 'http://117.34.105.87:10560';//服务器IP
const baseUrl  = 'http://192.168.1.109:80';//李思雨IP
//用户管理
export const getHospitalList = async params => axios.get(baseUrl  + '/hospital/getHospitalList', params);//查询医院清单
export const selectDepartmentByHospitalId = async params => axios.get(baseUrl  + '/department/selectDepartmentByHospitalId', params);//根据医院ID查询科室信息
export const queryDoctorByDepartmentId = async params => axios.get(baseUrl  + '/doctor/queryDoctorByDepartmentId', params);//根据科室ID查询医生信息
export const sales = async params => axios.post(baseUrl  + '/sale/base/sales', params);//下单产品列表
export const queryGuideByPage = async params => axios.post(baseUrl  + '/wx/queryGuideByPage', params);//查询列表
export const queryGuideDetail = async params => axios.post(baseUrl  + '/wx/queryGuideDetail', params);//下单详情查询列表
export const addGuideDetail = async params => axios.post(baseUrl  + '/wx/addGuideDetail', params);//下单详情添加
const baseUrl_er  = 'http://117.34.105.87:88';  //二龙服务器
export const GetScanGongZhongHaoList = async params => axios.post(baseUrl_er  + '/api/Community/GetScanGongZhongHaoList', params);//查询列表
export const InsertGongZhongHao = async params => axios.post(baseUrl_er  + '/api/Community/InsertGongZhongHao', params);//增加和修改
//   /api/Community/ExportDataGongZhongHao?hospital=&deptment=&doctor=&isvisit=&scanphone=&yuyuephone=&startyuyuetime=&endyuyuetime= 导出
/*
*
*
*导出文件路径
*
*/
const ExportUrl = baseUrl +"/wx/exportGuideInfo"
const ExportDataGongZhongHao2 = baseUrl +"/api/Community/ExportDataGongZhongHao2"
export default{
    baseUrl ,
    ExportUrl,
    baseUrl_er,
    ExportDataGongZhongHao2
}