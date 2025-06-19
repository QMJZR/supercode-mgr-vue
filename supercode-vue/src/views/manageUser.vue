<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getUserData,
  createUser,
  changeUserData,
  deleteUser,
  type UserInfo,
  changeUserRole,
  getAllUsers, RetUserVO, // 新增
} from '../api/mgr/user';
import { useRouter } from 'vue-router';

// 返回按钮路由
const router = useRouter();

const newUser = reactive({
  username: '',
  password: '',
  email: '',
  nickname: '',
  role: 'admin',
});

const editUser = reactive({
  username: '',
  email: '',
  nickname: '',
});

const usernameToDelete = ref('');

const users = ref<RetUserVO[]>([]); // 用户列表数据

const fetchAllUsers = async () => {
  try {
    const res = await getAllUsers();
    if (res.data.code === 200) {
      users.value = res.data.data;
    } else {
      ElMessage.error(res.data.msg || '获取用户列表失败');
    }
  } catch (e) {
    ElMessage.error('获取用户列表异常');
  }
};

onMounted(() => {
  fetchAllUsers();
});

const handleCreateUser = async () => {
  try {
    const response = await createUser(newUser);
    const res = response.data;
    if (res.code === 200) {
      ElMessage.success('用户创建成功');
      fetchAllUsers();
    } else {
      ElMessage.error(res.msg || '用户创建失败');
    }
  } catch (e) {
    ElMessage.error('请求异常，请稍后重试');
  }
};

const handleDeleteUserByInput = async () => {
  const username = usernameToDelete.value.trim();
  if (!username) {
    ElMessage.warning('请输入用户名');
    return;
  }

  try {
    const response = await deleteUser(username);
    const res = response.data;

    if (res.code === 200) {
      ElMessage.success(`用户 ${username} 删除成功`);
      usernameToDelete.value = '';
      fetchAllUsers();
    } else {
      ElMessage.error(res.msg || '删除失败');
    }
  } catch (error) {
    ElMessage.error('请求失败，请检查网络或服务端');
  }
};

const handleEditUser = async () => {

  if (!editUser.username.trim()) {
    ElMessage.warning('请输入用户名');
    return;
  }

  const payload = {
    username: editUser.username.trim(),
    email: editUser.email,
    name: editUser.nickname,
  };
  console.log('准备提交的用户信息：', payload);

  try {
    const response = await changeUserData(payload);
    const res = response.data;
    console.log('后端返回：', res);
    if (res.code === 200) {
      ElMessage.success('用户信息修改成功');
      fetchAllUsers();
    } else {
      ElMessage.error(res.msg || '修改失败');
    }
  } catch (e) {
    console.error('请求异常', e);
    ElMessage.error('请求异常，请稍后重试');
  }
};

//改变职能
const roleChangeUser = reactive({
  username: '',
  role: 'user',
});

const handleChangeUserRole = async () => {

  const username = roleChangeUser.username.trim();
  if (!username) {
    ElMessage.warning('请输入用户名');
    return;
  }

  try {
    const response = await changeUserRole({ username, role: roleChangeUser.role });
    const res = response.data;
    if (res.code === 200) {
      ElMessage.success('用户职能更新成功');
      roleChangeUser.username = '';
      roleChangeUser.role = 'user';
      fetchAllUsers();
    } else {
      ElMessage.error(res.msg || '更新失败');
    }
  } catch (e) {
    ElMessage.error('请求异常，请稍后重试');
  }
};
</script>

<template>
  <div class="p-6 space-y-4">
    <el-button type="info" @click="router.push('/admin')">返回</el-button>

    <h2 class="text-xl font-bold">用户管理</h2>

    <el-divider />

    <!-- 新增：折叠面板查看所有用户 -->
    <el-collapse>
      <el-collapse-item title="查看所有用户" name="1">
        <el-table :data="users" style="width: 100%">
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="nickname" label="昵称" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="职能" />
        </el-table>
      </el-collapse-item>
    </el-collapse>

    <el-divider />

    <el-form inline autocomplete="off">
      <el-form-item label="用户名"><el-input v-model="newUser.username" /></el-form-item>
      <el-form-item label="密码"><el-input type="password" v-model="newUser.password" /></el-form-item>
      <el-form-item label="邮箱"><el-input v-model="newUser.email" /></el-form-item>
      <el-form-item label="昵称"><el-input v-model="newUser.nickname" /></el-form-item>
      <el-form-item label="身份">
        <el-select
            v-model="newUser.role"
            placeholder="选择角色"
            filterable
            clearable
            style="width: 200px"
        >
          <el-option label="普通用户" value="user" />
          <el-option label="管理员" value="admin" />
          <el-option label="超级管理员" value="root" />
        </el-select>
      </el-form-item>
      <el-form-item><el-button type="primary" @click="handleCreateUser">添加用户</el-button></el-form-item>
    </el-form>

    <el-divider />

    <el-form inline autocomplete="off">
      <el-form-item label="要删除的用户名">
        <el-input v-model="usernameToDelete" placeholder="输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="handleDeleteUserByInput">删除用户</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <el-form inline autocomplete="off">
      <el-form-item label="用户名（要修改）">
        <el-input v-model="editUser.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item label="新邮箱">
        <el-input v-model="editUser.email" placeholder="新的邮箱" />
      </el-form-item>
      <el-form-item label="新昵称">
        <el-input v-model="editUser.nickname" placeholder="新的昵称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleEditUser">修改用户信息</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <el-form inline autocomplete="off" class="space-x-4">
      <el-form-item label="用户名（修改职能）">
        <el-input v-model="roleChangeUser.username" placeholder="输入用户名" />
      </el-form-item>
      <el-form-item label="新职能">
        <el-select
            v-model="roleChangeUser.role"
            placeholder="选择新角色"
            filterable
            clearable
            style="width: 200px"
        >
          <el-option label="普通用户" value="user" />
          <el-option label="管理员" value="admin" />
          <el-option label="超级管理员" value="root" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleChangeUserRole">改变职能</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
