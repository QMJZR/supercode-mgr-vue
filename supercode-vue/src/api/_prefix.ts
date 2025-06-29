// _prefix.ts

// 通用前缀
export const API_MODULE = "/api/v1"
export const MGR_MODULE = "/mgr"

// 用户相关
export const USER_MODULE = `${API_MODULE}/user`
export const LOGIN_URL = `${USER_MODULE}/login`
export const PASSWORD_URL = `${USER_MODULE}/password`

export const UPDATE_USER = `${API_MODULE}${MGR_MODULE}/user/updateUser`
// 题目相关
export const MGR_PROBLEM_MODULE = `${API_MODULE}${MGR_MODULE}/problem`

// 管理接口
export const MGR_USER_MODULE = `${API_MODULE}${MGR_MODULE}/user`

