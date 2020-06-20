import Axios from 'axios';
// import { Message } from 'element-ui';
// import { trimExt } from 'upath';
const $http = Axios;
const get = (url, params = {}) => {
    if (!url) return;
    return $http({
        method: 'get',
        url,
        params: params,
    })
}
const post = (url, params = {}) => {
    if (!url) return;
    return $http({
        method: 'post',
        url,
        data: params,
        // withCredentials: true
    })
}
export default{
    get,
    post,
}