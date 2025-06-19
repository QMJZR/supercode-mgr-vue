import request from '../../utils/request'

import {USER_MODULE, MGR_USER_MODULE, UPDATE_USER} from '../../api/_prefix'


export interface LoginForm {
    username: string;
    password: string;
}

export interface UserInfo {
    username: string;
    email: string;
    nickname: string;
    role: string;
}

interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T;
}

export const userLogin: (loginForm: LoginForm) => Promise<string> = async (
    loginForm: LoginForm
) => {
    const resp = await request.post(`${USER_MODULE}/login`, loginForm);
    const result: ApiResponse<string> = resp.data;
    if (result.code === 200) {
        return result.data;
    }
    throw Error(result.msg);
};


// 创建用户
export function createUser(data: {
    username: string
    password: string
    email: string
    nickname: string
    role: string
}) {
    return request.post(`${MGR_USER_MODULE}/create`, data)
}



//修改信息
export function changeUserData(data: {
    username: string
    email: string
    name: string
}) {
    return request.put(`${UPDATE_USER}`, data)
}

//获取用户信息

export function getUserData() {
    return request.get<ApiResponse<UserInfo>>(`${USER_MODULE}`);
}

// 改变用户权限
export function changeUserRole(data: { username: string; role: string }) {
    return request.post(`${MGR_USER_MODULE}/changeRole`, data);
}

// 删除用户
export function deleteUser(username: string) {
    return request.delete(`${MGR_USER_MODULE}/${username}`)
}

export interface RetUserVO {
    username: string;
    nickname: string;
    email: string;
    role: string;
}

export function getAllUsers() {
    return request.get<ApiResponse<RetUserVO[]>>(`${MGR_USER_MODULE}/getUsers`);
}

