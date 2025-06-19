<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {getOneProblem, StdioVO, submitCode as submitCodeApi} from '../api/mgr/problem'

const router = useRouter()
const route = useRoute()
const problemId = ref(route.params.problemId as string)

// 题目数据
const problemData = ref({
  title: '',
  description: '',
  time_limit: 0,
  memory_limit: 0,
  output_limit: 0,
  example_stdio: [] as StdioVO[],
  constraints: [] as string[]
})

// 用户代码
const userCode = ref('')
const lang = ref('C') // 默认设置为 C
const isSubmitting = ref(false)
const lastSubmitTime = ref(0)
const submitStatus = ref({
  message: '',
  type: '' // 'success', 'error', 'info'
})

// 只保留支持的语言列表
const languages = [
  { id: 'C', name: 'C' },
  { id: 'C++', name: 'C++' },
  { id: 'Java', name: 'Java' }
]

// 获取题目详情
const fetchProblem = async () => {
  console.log('开始请求题目，problemId:', problemId.value)
  try {
    const response = await getOneProblem(problemId.value)
    const data = response.data.data

    if (data) {
      problemData.value = {
        title: data.title,
        description: data.description,
        time_limit: data.timeLimit,
        memory_limit: data.memoryLimit,
        output_limit: data.outputLimit,
        example_stdio: data.exampleStdio,
        constraints: [
          `时间限制: ${data.timeLimit} 秒`,
          `内存限制: ${Math.floor(data.memoryLimit / 1024)} MB`,
          `输出限制: ${data.outputLimit} 字节`
        ]
      }
    }
  } catch (error) {
    console.error('获取题目失败:', error)
    submitStatus.value = {
      message: '获取题目信息失败，请刷新重试',
      type: 'error'
    }
  }
}

// 提交代码
const submitCode = async () => {
  if (isSubmitting.value) return

  const currentTime = Date.now()
  if (currentTime - lastSubmitTime.value < 10000) {
    submitStatus.value = {
      message: '提交过于频繁，请10秒后再试',
      type: 'error'
    }
    return
  }

  if (!userCode.value.trim()) {
    submitStatus.value = {
      message: '代码内容不能为空',
      type: 'error'
    }
    return
  }

  isSubmitting.value = true
  lastSubmitTime.value = currentTime
  submitStatus.value = { message: '提交中...', type: 'info' }

  try {
    const response = await submitCodeApi({
      problemId: problemId.value,
      lang: lang.value,
      code: userCode.value
    })
    console.log('当前语言:', lang.value)
    console.log('提交返回数据:', response.data)

    submitStatus.value = {
      message: response.data.msg || '提交成功',
      type: response.data.code === 200 ? 'success' : 'error'
    }

    userCode.value = ''
  } catch (error: any) {
    submitStatus.value = {
      message: error?.response?.data?.msg || '提交失败，请稍后重试',
      type: 'error'
    }
  } finally {
    isSubmitting.value = false
  }
}

// 初始化默认代码模板
const initCodeTemplate = () => {
  switch (lang.value) {
    case 'C':
      userCode.value = `#include <stdio.h>\n\nint main() {\n    // 请在此编写你的代码\n    return 0;\n}`
      break
    case 'C++':
      userCode.value = `#include <iostream>\nusing namespace std;\n\nint main() {\n    // 请在此编写你的代码\n    return 0;\n}`
      break
    case 'Java':
      userCode.value = `public class Main {\n    public static void main(String[] args) {\n        // 请在此编写你的代码\n    }\n}`
      break
    default:
      userCode.value = '// 不支持的语言'
  }
}

// 语言变更时更新代码模板
const onLanguageChange = () => {
  initCodeTemplate()
}

onMounted(() => {
  fetchProblem()
  initCodeTemplate()
})
</script>



<template>
  <div class="code-eval-container">
    <el-button
        type="info"
        class="fixed-back-button"
        @click="router.push('/admin')"
        icon="el-icon-arrow-left"
        plain
    >
      返回管理页面
    </el-button>

    <!-- 题目要求区域 -->
    <div class="problem-section">
      <div v-if="problemData.title" class="problem-content">
        <h1 class="problem-title">{{ problemData.title }}</h1>

        <div class="problem-description">
          <p>{{ problemData.description }}</p>
        </div>

        <div v-for="(example, index) in problemData.example_stdio" :key="index" class="example">
          <div class="example-input">
            <strong>输入:</strong> <pre>{{ example.stdin }}</pre>
          </div>
          <div class="example-output">
            <strong>输出:</strong> <pre>{{ example.stdout }}</pre>
          </div>
          <div v-if="example.stderr" class="example-explanation">
            <strong>解释:</strong> {{ example.stderr }}
          </div>
        </div>

        <div class="constraints-section">
          <h2>约束条件:</h2>
          <ul>
            <li v-for="(constraint, index) in problemData.constraints" :key="index">
              {{ constraint }}
            </li>
          </ul>
        </div>
      </div>

      <div v-else class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载题目信息...</p>
      </div>
    </div>

    <!-- 代码提交区域 -->
    <div class="submission-section">
      <div class="submission-header">
        <h2>代码编辑器</h2>
        <div class="language-selector">
          <label for="language">编程语言: </label>
          <select id="language" v-model="lang" @change="onLanguageChange">
            <option v-for="lang in languages" :key="lang.id" :value="lang.id">
              {{ lang.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="code-editor">
        <textarea
            v-model="userCode"
            placeholder="在此处编写代码..."
            spellcheck="false"
        ></textarea>
      </div>

      <div class="actions">
        <div class="status-message" :class="submitStatus.type">
          {{ submitStatus.message }}
        </div>
        <button
            @click="submitCode"
            :disabled="isSubmitting"
            :class="{ 'submitting': isSubmitting }"
        >
          <span v-if="!isSubmitting">提交评测</span>
          <span v-else>评测中...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed-back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.code-eval-container {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
}

.problem-section {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: white;
  border-right: 1px solid #e0e6ed;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.submission-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  color: #d4d4d4;
}

.problem-title {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.problem-description {
  margin-bottom: 25px;
  line-height: 1.6;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.examples-section, .constraints-section {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
  border-left: 4px solid #3498db;
}

.example {
  margin: 15px 0;
  padding: 10px;
  background-color: #e8f4fd;
  border-radius: 4px;
}

.example-input, .example-output, .example-explanation {
  margin: 5px 0;
}

.example-input pre, .example-output pre {
  margin: 5px 0;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-family: monospace;
}

.constraints-section ul {
  padding-left: 20px;
}

.constraints-section li {
  margin-bottom: 8px;
  font-family: monospace;
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #252526;
  border-bottom: 1px solid #3c3c3c;
}

.language-selector {
  display: flex;
  align-items: center;
}

.language-selector label {
  margin-right: 10px;
  color: #d4d4d4;
}

.language-selector select {
  background-color: #3c3c3c;
  color: #d4d4d4;
  border: 1px solid #0078d7;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 14px;
}

.code-editor {
  flex: 1;
  padding: 15px;
}

.code-editor textarea {
  width: 100%;
  height: 100%;
  background-color: #1e1e1e;
  color: #d4d4d4;
  border: none;
  resize: none;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 10px;
  border-radius: 4px;
  box-sizing: border-box;
  tab-size: 4;
}

.code-editor textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px #0078d7;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #252526;
  border-top: 1px solid #3c3c3c;
}

.status-message {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.status-message.info {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-message.success {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-message.error {
  background-color: #fff2f0;
  color: #ff4d4f;
}

button {
  background-color: #0078d7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #106ebe;
}

button:disabled {
  background-color: #5e5e5e;
  cursor: not-allowed;
}

.submitting {
  position: relative;
  padding-left: 40px;
}

.submitting::before {
  content: "";
  position: absolute;
  left: 20px;
  top: 50%;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>