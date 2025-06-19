import { MockMethod } from 'vite-plugin-mock';

let mockUsers = [
    {
        username: 'admin',
        password: '123456',
        email: 'admin@example.com',
        nickname: '管理员',
        role: 'admin',
    },
    {
        username: 'user1',
        password: 'password1',
        email: 'user1@example.com',
        nickname: '普通用户1',
        role: 'user',
    },
];

export default [
    // 登录
    {
        url: '/api/v1/user/login',
        method: 'post',
        response: ({ body }) => {
            const user = mockUsers.find(u => u.username === body.username && u.password === body.password);
            if (user) {
                return { code: 200, msg: null, data: '登录成功' };
            }
            return { code: 401, msg: '用户名或密码错误', data: null };
        },
    },

    // 获取当前用户信息
    {
        url: '/api/v1/user',
        method: 'get',
        response: () => {
            // 模拟当前登录的是admin
            const currentUser = mockUsers[0];
            const { password, ...userInfo } = currentUser; // 去掉密码
            return {
                code: 200,
                msg: null,
                data: userInfo,
            };
        },
    },

    // 创建用户
    {
        url: '/api/v1/mgr/user/create',
        method: 'post',
        response: ({ body }) => {
            const exists = mockUsers.some(u => u.username === body.username);
            if (exists) {
                return { code: 409, msg: '用户名已存在', data: null };
            }
            mockUsers.push({ ...body, role: 'user' });
            return { code: 200, msg: '创建成功', data: null };
        },
    },

    // 修改用户信息
    {
        url: '/api/v1/user',
        method: 'post',
        response: ({ body }) => {
            const user = mockUsers.find(u => u.username === body.username);
            console.log(user);
            if (!user) {
                return { code: 404, msg: '用户不存在', data: null };
            }
            if(user.role === 'admin') {
                return {code: 403, msg: '权限不足', data: null}
            }
            user.email = body.email;
            user.nickname = body.nickname;
            return { code: 200, msg: '更新成功', data: null };
        },
    },

    // 删除用户
    {
        url: '/api/v1/mgr/user/:username',
        method: 'delete',
        response: ({ url }) => {
            // 从 URL 手动解析 username
            const match = url?.match(/\/api\/v1\/mgr\/user\/(.+)$/);
            const username = match?.[1];

            if (!username) {
                return { code: 400, msg: '请求路径错误', data: null };
            }
            console.log('删除用户名是：', username);

            const index = mockUsers.findIndex(u => u.username === username);
            console.log('index是：', index);
            if (index === -1) {
                return { code: 404, msg: '用户不存在', data: null };
            }
            else if(mockUsers[index].role === 'admin') {
                return { code: 403, msg: '权限不足', data: null };
            }
            mockUsers.splice(index, 1);
            return { code: 200, msg: '删除成功', data: null };
        },
    },
] as MockMethod[];
