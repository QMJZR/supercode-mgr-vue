import request from '../../utils/request'
import {API_MODULE, MGR_PROBLEM_MODULE} from "../_prefix";

// 类型定义
export interface StdioVO {
    stdin: string
    stdout: string
    stderr: string
}

export interface ProblemPayload {
    title: string
    description: string
    timeLimit: number
    timeReserved: number
    memoryLimit: number
    memoryReserved: number
    largeStack: boolean
    outputLimit: number
    processLimit: number
    exampleStdio: StdioVO[]
    stdio: StdioVO[]
}

// 创建题目
export function createProblem(data: ProblemPayload) {
    return request.post(`${MGR_PROBLEM_MODULE}/create`, data)
}

// 修改题目（加上 problemId）
export function updateProblem(data: ProblemPayload & { problemId: string }) {
    return request.put(`${MGR_PROBLEM_MODULE}`, data)
}

// 获取单个题目
export interface ProblemData extends ProblemPayload {}

interface ApiResponse<T> {
    code: number;
    msg: string | null;
    data: T | null;
}

export function getOneProblem(problemId: string) {
    return request.get<ApiResponse<ProblemData>>(`${MGR_PROBLEM_MODULE}/${problemId}`)
}

// 删除题目
export function deleteProblem(problemId: string) {
    return request.delete(`${MGR_PROBLEM_MODULE}/${problemId}`)
}

//获取全部题目

export interface SimpleProblemVO {
    uuid: string
    title: string
}

export function getProblems() {
    return request.get<ApiResponse<SimpleProblemVO[]>>(`api/v1/problem`)
}

//提交代码
export function submitCode(data: {
    problemId: string
    lang: string
    code: string
}) {
    const { problemId, ...rest } = data
    return request.post(`/api/v1/problem/${problemId}`, rest)
}

export interface SimpleSubmissionResultVO {
    submitId: string;
    problemId: string;
    lang: string;
    time?: number;
    memory?: number;
    result: string;
    submissionTime: string;
    score?: number;
}

// 获取当前用户的所有提交记录
export function getMySubmissions() {
    return request.get<ApiResponse<SimpleSubmissionResultVO[]>>('/api/v1/problem/submit');
}