<script setup lang="ts">
import { userLogin, type LoginForm } from "../api/mgr/user";
import { router } from "../router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { reactive, ref } from "vue";

const loginForm = reactive<LoginForm>({
  username: "",
  password: "",
});

const loginRules = reactive<FormRules<LoginForm>>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const loginRuleFormRef = ref<FormInstance | null>(null);

const submitLoginForm = (formEl: FormInstance | null) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        const token = await userLogin(loginForm);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("username", loginForm.username);
        sessionStorage.setItem("password", loginForm.password);
        ElMessage.success("登录成功");
        router.push("/admin");
        formEl.resetFields();
      } catch (error) {
        ElMessage.error(String(error));
      }
    }
  });
};
</script>

<template>
  <el-main class="main-frame bg-gradient">
    <el-card class="login-card">
      <h1 class="title">番茄书店</h1>
      <el-form
          ref="loginRuleFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
          label-width="auto"
          class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              show-password
              autocomplete="current-password"
          />
        </el-form-item>
        <el-form-item class="btn-item">
          <el-button type="primary" class="login-btn" @click="submitLoginForm(loginRuleFormRef)">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-main>
</template>

<style scoped>
.main-frame {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem; /* 上下左右都有空隙 */
}

.bg-gradient {
  background: linear-gradient(to right, #d0e8ff, #e9f4ff);
}

.login-card {
  width: 60%;
  max-width: 400px;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
  background-color: rgba(255 255 255 / 0.9);
}

.title {
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  user-select: none;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.btn-item {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.login-btn {
  width: 100px;
}
</style>
