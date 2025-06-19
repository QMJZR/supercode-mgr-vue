import request from '../../utils/request';
const MGR_PROBLEM = '/mgr/problem';
// 创建题目
export function createProblem(data) {
    return request.post(`${MGR_PROBLEM}/create`, data);
}
// 修改题目
export function updateProblem(data) {
    return request.put(`${MGR_PROBLEM}`, data);
}
export function getProblem(problemId) {
    return request.get(`${MGR_PROBLEM}/${problemId}`);
}
// 删除题目
export function deleteProblem(problemId) {
    return request.delete(`${MGR_PROBLEM}/${problemId}`);
}
