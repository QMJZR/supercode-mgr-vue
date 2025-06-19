<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {getProblems, SimpleProblemVO} from "../api/mgr/problem";
const router = useRouter();

const username = ref(sessionStorage.getItem('username') || '未登录');
const password = ref(sessionStorage.getItem('password') || '');
const passwordMasked = ref(password.value ? '*'.repeat(password.value.length) : '');

const problems = ref<SimpleProblemVO[]>([]);
const isProblemListLoaded = ref(false);

const handleProblemClick = (problemId: string) => {
  router.push(`/code/${problemId}`);
};

const handleCollapseChange = async () => {
  if (!isProblemListLoaded.value) {
    const res = (await getProblems()).data;
    if (res.code === 200 && res.data) {
      problems.value = res.data ?? [];
      isProblemListLoaded.value = true;
    }
  }
};
</script>

<template>
  <div class="main-frame bg-gradient">
    <el-card class="login-card" shadow="hover">
      <h1 class="title">管理后台</h1>

      <div class="user-info">
        <span>当前用户：{{ username }}</span>
        <span v-if="password">密码：{{ passwordMasked }}</span>
      </div>

      <div class="btn-item">
        <el-button type="primary" @click="router.push('/manage-user')">用户管理</el-button>
      </div>
      <div class="btn-item">
        <el-button type="success" @click="router.push('/manage-problem')">题目管理</el-button>
      </div>

      <!-- 可折叠的题目列表，会跳转到答题界面 -->
      <el-collapse @change="handleCollapseChange">
        <el-collapse-item title="题目列表" name="1">
          <div v-if="problems.length === 0">暂无题目</div>
          <el-list>
            <el-list-item
                v-for="problem in problems"
                :key="problem.uuid"
                class="problem-item"
                @click="handleProblemClick(problem.uuid)"
            >
              {{ problem.title }}
            </el-list-item>
          </el-list>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<style scoped>
.main-frame {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.bg-gradient {
  background: linear-gradient(to right, #d0e8ff, #e9f4ff);
}

.login-card {
  width: 60%;
  max-width: 500px;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
  background-color: rgba(255 255 255 / 0.9);
  text-align: center;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #333;
  user-select: none;
}

.user-info {
  margin-bottom: 2rem;
  font-size: 1rem;
  color: #555;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.btn-item {
  margin-top: 1rem;
}

.el-button {
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
}

.problem-item {
  cursor: pointer;
  padding: 0.5rem;
  text-align: left;
  transition: background 0.2s;
}
.problem-item:hover {
  background-color: #f2f8ff;
}
</style>
