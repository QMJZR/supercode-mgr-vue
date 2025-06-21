<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getMySubmissions, type SimpleSubmissionResultVO } from '../api/mgr/problem';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const submissions = ref<SimpleSubmissionResultVO[]>([]);

const fetchSubmissions = async () => {
  try {
    const res = await getMySubmissions();
    if (res.data?.code === 200) {
      submissions.value = res.data.data || [];
    } else {
      ElMessage.error(res.data.msg || '获取提交记录失败');
    }
  } catch (e) {
    ElMessage.error('请求异常，请稍后重试');
  }
};

onMounted(() => {
  fetchSubmissions();
});
</script>

<template>
  <div class="p-6 space-y-4">
    <el-button type="info" @click="router.push('/admin')">返回</el-button>

    <h2 class="text-xl font-bold">我的提交记录</h2>

    <el-table :data="submissions" style="width: 100%" stripe border>
      <el-table-column prop="submitId" label="提交ID" width="160" />
      <el-table-column prop="problemId" label="题目ID" width="140" />
      <el-table-column prop="lang" label="语言" width="100" />
      <el-table-column prop="time" label="耗时(ms)" width="100" />
      <el-table-column prop="memory" label="内存(KB)" width="100" />
      <el-table-column prop="score" label="得分" width="80" />
      <el-table-column prop="result" label="结果" width="120" />
      <el-table-column prop="submissionTime" label="提交时间" width="200" />
    </el-table>
  </div>
</template>
