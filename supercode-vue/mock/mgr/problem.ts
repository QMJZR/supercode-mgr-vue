import { MockMethod } from 'vite-plugin-mock';

interface IOExample {
    0: string; // stdin
    1: string; // stdout
    2: string; // stderr
}

interface ProblemPayload {
    title: string;
    description: string;
    time_limit: number;
    time_reserved: number;
    memory_limit: number;
    memory_reserved: number;
    large_stack: boolean;
    output_limit: number;
    process_limit: number;
    example_stdio: IOExample[];
    stdio?: IOExample[];
}

interface ProblemData extends ProblemPayload {
    problemId: string;
}

let problemStore: ProblemData[] = [
    {
        problemId: '1',
        title: '示例题目1',
        description: '这是一个示例题目',
        time_limit: 2,
        time_reserved: 1,
        memory_limit: 262144,
        memory_reserved: 262144,
        large_stack: false,
        output_limit: 1000,
        process_limit: 1,
        example_stdio: [['input1', 'output1', 'error1']],
        stdio: [['stdin1', 'stdout1', 'stderr1']],
    },
];

// 初始化currentId为现有最大ID的数字值，或0
let currentId = problemStore.length > 0 ? Math.max(...problemStore.map(p => Number(p.problemId))) : 0;

function generateId() {
    currentId += 1;
    return currentId.toString();
}

export default [
    // 创建题目
    {
        url: '/api/v1/mgr/problem/create',
        method: 'post',
        response: ({ body }) => {
            const problemId = generateId();
            const newProblem: ProblemData = {
                problemId,
                ...body,
            };
            problemStore.push(newProblem);
            return {
                code: 200,
                msg: '创建成功',
                data: problemId,
            };
        },
    },

    // 更新题目
    {
        url: '/api/v1/mgr/problem',
        method: 'put',
        response: ({ body }) => {
            const { problemId, ...updateData } = body;
            const idx = problemStore.findIndex(p => p.problemId === problemId);
            if (idx === -1) {
                return { code: 404, msg: '题目不存在', data: null };
            }
            problemStore[idx] = { problemId, ...updateData };
            return { code: 200, msg: '更新成功', data: null };
        },
    },

    // 获取题目详情
    {
        url: '/api/v1/mgr/problem/:problemId',
        method: 'get',
        response: ({ query }) => {
            const id = query.problemId;
            const problem = problemStore.find(p => p.problemId === id);
            if (!problem) {
                return { code: 404, msg: '题目不存在', data: null };
            }
            return { code: 200, msg: null, data: problem };
        },
    },

    // 删除题目
    {
        url: '/api/v1/mgr/problem/:problemId',
        method: 'delete',
        response: ({ query }) => {
            const id = query.problemId;
            const idx = problemStore.findIndex(p => p.problemId === id);
            if (idx === -1) {
                return { code: 404, msg: '题目不存在', data: null };
            }
            problemStore.splice(idx, 1);
            return { code: 200, msg: '删除成功', data: null };
        },
    },
] as MockMethod[];
