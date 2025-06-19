import request from '../../utils/request';
import { USER_MODULE, MGR_USER_MODULE } from '../../api/_prefix';
export const userLogin = async (loginForm) => {
    const resp = await request.post(`${USER_MODULE}/login`, loginForm);
    const result = resp.data;
    if (result.code === 200) {
        return result.data;
    }
    throw Error(result.msg);
};
// 创建用户
export function createUser(data) {
    return request.post(`${MGR_USER_MODULE}/create`, data);
}
//修改信息
export function changeUserData(data) {
    return request.post(`${USER_MODULE}`, data);
}
//获取用户信息
export function getUserData() {
    return request.get(`${USER_MODULE}`);
}
// 删除用户
export function deleteUser(username) {
    return request.delete(`${MGR_USER_MODULE}/${username}`);
}
