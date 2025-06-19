<script setup lang="ts">
import {ref, reactive, computed, onMounted} from 'vue';
import { ElMessage } from 'element-plus';
import {
  getOneProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblems,
  type ProblemData, SimpleProblemVO,
} from '../api/mgr/problem';
import { useRouter } from 'vue-router';

const router = useRouter();

const problems = ref<Map<string, ProblemData>>(new Map());
const queryProblemId = ref('');
const queriedProblem = ref<ProblemData | null>(null);
const allProblems = ref<SimpleProblemVO[]>([]);

const newProblem = reactive<ProblemData>({
  title: '',
  description: '',
  timeLimit: 1,
  timeReserved: 1,
  memoryLimit: 256000,
  memoryReserved: 256000,
  largeStack: false,
  outputLimit: 0,
  processLimit: 0,
  exampleStdio: [{ stdin: '', stdout: '', stderr: '' }],
  stdio: [{ stdin: '', stdout: '', stderr: '' }],
});

const fetchAllProblems = async () => {
  try {
    const res = await getProblems();
    if (res.data.code === 200) {
      allProblems.value = res.data.data ?? [];
    } else {
      ElMessage.error(res.data.msg || '获取题目列表失败');
    }
  } catch {
    ElMessage.error('获取题目列表异常');
  }
};

onMounted(() => {
  fetchAllProblems();  // 页面加载时获取全部题目
});

const problemsArray = computed(() => Array.from(problems.value.entries()));

async function handleQueryProblem() {
  try {
    const res = await getOneProblem(queryProblemId.value);
    if (res.data.code === 200 && res.data.data) {
      const data = res.data.data;

      // 处理 outputLimit 等数值字段，保证它们不是 null 或 undefined
      data.outputLimit = data.outputLimit ?? 0;
      data.processLimit = data.processLimit ?? 0;
      data.timeLimit = data.timeLimit ?? 1;
      data.timeReserved = data.timeReserved ?? 1;
      data.memoryLimit = data.memoryLimit ?? 256000;
      data.memoryReserved = data.memoryReserved ?? 256000;
      data.largeStack = data.largeStack ?? false;
      data.exampleStdio = data.exampleStdio ?? [{ stdin: '', stdout: '', stderr: '' }];
      data.stdio = data.stdio ?? [{ stdin: '', stdout: '', stderr: '' }];

      queriedProblem.value = data;
      problems.value.clear();
      problems.value.set(queryProblemId.value, data);
      ElMessage.success('查询成功');
    } else {
      queriedProblem.value = null;
      ElMessage.warning(res.data.msg || '未找到题目');
    }
  } catch {
    queriedProblem.value = null;
    ElMessage.error('查询失败');
  }
}

async function handleCreateProblem() {
  try {
    const res = await createProblem(newProblem);
    if (res.data.code === 200) {
      ElMessage.success('题目创建成功');
    } else {
      ElMessage.error(res.data.msg || '题目创建失败');
    }
  } catch {
    ElMessage.error('题目创建失败');
  }
}

async function handleUpdateProblem(id: string) {
  const problem = problems.value.get(id);
  if (problem) {
    try {
      const res = await updateProblem({ problemId: id, ...problem });
      if (res.data.code === 200) {
        ElMessage.success('题目更新成功');
        problems.value.clear(); // 修改成功后清空题目列表
      } else {
        ElMessage.error(res.data.msg || '更新失败');
      }
    } catch {
      ElMessage.error('更新失败');
    }
  }
}

async function handleDeleteProblem(id: string) {
  try {
    const res = await deleteProblem(id);
    if (res.data.code === 200) {
      problems.value.delete(id);
      ElMessage.success('删除成功');
    } else {
      ElMessage.error(res.data.msg || '删除失败');
    }
  } catch {
    ElMessage.error('删除失败');
  }
}
</script>


<template>
  <el-divider />

  <el-collapse>
    <el-collapse-item name="1">
      <template #title>
        <h2 class="text-xl font-bold mb-2">查看所有题目</h2>
      </template>

      <el-table :data="allProblems" style="width: 100%">
        <el-table-column prop="uuid" label="题目ID" />
        <el-table-column prop="title" label="题目标题" />
      </el-table>
    </el-collapse-item>
  </el-collapse>

  <el-divider />


  <div class="p-6 space-y-4">
    <el-button type="info" @click="router.push('/admin')">返回</el-button>

    <h2 class="text-xl font-bold mb-2">查询 / 删除题目</h2>
    <el-form inline autocomplete="off">
      <el-form-item label="题目ID">
        <el-input v-model="queryProblemId" placeholder="请输入题目ID" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQueryProblem">查询</el-button>
        <el-button
            type="danger"
            :disabled="!queryProblemId"
            @click="handleDeleteProblem(queryProblemId)"
        >
          删除
        </el-button>
      </el-form-item>
    </el-form>

    <div v-if="queriedProblem" class="mt-4 border p-4 rounded">
      <h3 class="font-semibold mb-2">题目详情</h3>
      <p><strong>标题：</strong>{{ queriedProblem.title }}</p>
      <p><strong>描述：</strong>{{ queriedProblem.description }}</p>
    </div>

    <el-divider />

    <h2 class="text-xl font-bold mb-2">创建新题目</h2>
    <el-form label-width="120px" class="w-full">
      <el-form-item label="标题">
        <el-input v-model="newProblem.title" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="newProblem.description" />
      </el-form-item>
      <el-form-item label="时间限制">
        <el-input-number v-model="newProblem.timeLimit" :min="1" />
      </el-form-item>
      <el-form-item label="时间保留">
        <el-input-number v-model="newProblem.timeReserved" :min="0" />
      </el-form-item>
      <el-form-item label="内存限制(KB)">
        <el-input-number v-model="newProblem.memoryLimit" :min="1024" :step="1024" />
      </el-form-item>
      <el-form-item label="内存保留(KB)">
        <el-input-number v-model="newProblem.memoryReserved" :min="1024" :step="1024" />
      </el-form-item>
      <el-form-item label="开大栈">
        <el-switch v-model="newProblem.largeStack" />
      </el-form-item>
      <el-form-item label="输出限制行数">
        <el-input-number v-model="newProblem.outputLimit" :min="0" />
      </el-form-item>
      <el-form-item label="进程限制">
        <el-input-number v-model="newProblem.processLimit" :min="0" />
      </el-form-item>

      <!-- 示例输入输出动态列表 -->
      <el-form-item label="示例输入输出">
        <div
            v-for="(ex, index) in newProblem.exampleStdio"
            :key="'example-' + index"
            class="mb-4 border p-2 rounded"
        >
          <el-input v-model="ex.stdin" placeholder="示例输入" class="mb-1" />
          <el-input v-model="ex.stdout" placeholder="示例输出" class="mb-1" />
          <el-input v-model="ex.stderr" placeholder="错误输出" class="mb-1" />
          <el-button size="small" type="danger" @click="newProblem.exampleStdio.splice(index, 1)">删除示例</el-button>
        </div>
        <el-button size="small" @click="newProblem.exampleStdio.push({ stdin: '', stdout: '', stderr: '' })">添加示例</el-button>
      </el-form-item>

      <!-- 标准输入输出动态列表 -->
      <el-form-item label="标准输入输出">
        <div
            v-for="(io, index) in newProblem.stdio"
            :key="'stdio-' + index"
            class="mb-4 border p-2 rounded"
        >
          <el-input v-model="io.stdin" placeholder="标准输入" class="mb-1" />
          <el-input v-model="io.stdout" placeholder="标准输出" class="mb-1" />
          <el-input v-model="io.stderr" placeholder="错误输出" class="mb-1" />
          <el-button size="small" type="danger" @click="newProblem.stdio.splice(index, 1)">删除标准IO</el-button>
        </div>
        <el-button size="small" @click="newProblem.stdio.push({ stdin: '', stdout: '', stderr: '' })">添加标准IO</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleCreateProblem">创建题目</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <h2 class="text-xl font-bold mb-2">题目列表</h2>
    <div
        v-for="([id, problem]) in problemsArray"
        :key="id"
        class="border p-4 mb-4 rounded"
    >
      <p><strong>题目ID：</strong>{{ id }}</p>
      <el-form label-width="120px" class="mb-2">
        <el-form-item label="标题">
          <el-input v-model="problem.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="problem.description" />
        </el-form-item>

        <el-form-item label="时间限制">
          <el-input-number v-model="problem.timeLimit" :min="1" />
        </el-form-item>
        <el-form-item label="时间保留">
          <el-input-number v-model="problem.timeReserved" :min="0" />
        </el-form-item>

        <el-form-item label="内存限制(KB)">
          <el-input-number v-model="problem.memoryLimit" :min="1024" :step="1024" />
        </el-form-item>
        <el-form-item label="内存保留(KB)">
          <el-input-number v-model="problem.memoryReserved" :min="1024" :step="1024" />
        </el-form-item>

        <el-form-item label="开大栈">
          <el-switch v-model="problem.largeStack" />
        </el-form-item>

        <el-form-item label="输出限制行数">
          <el-input-number v-model="problem.outputLimit" :min="0" />
        </el-form-item>
        <el-form-item label="进程限制">
          <el-input-number v-model="problem.processLimit" :min="0" />
        </el-form-item>

        <!-- 示例输入输出动态列表 -->
        <el-form-item label="示例输入输出">
          <div
              v-for="(ex, index) in problem.exampleStdio"
              :key="`example-${id}-${index}`"
              class="mb-4 border p-2 rounded"
          >
            <el-input v-model="ex.stdin" placeholder="示例输入" class="mb-1" />
            <el-input v-model="ex.stdout" placeholder="示例输出" class="mb-1" />
            <el-input v-model="ex.stderr" placeholder="错误输出" class="mb-1" />
            <el-button size="small" type="danger" @click="problem.exampleStdio.splice(index, 1)">删除示例</el-button>
          </div>
          <el-button size="small" @click="problem.exampleStdio.push({ stdin: '', stdout: '', stderr: '' })">添加示例</el-button>
        </el-form-item>

        <!-- 标准输入输出动态列表 -->
        <el-form-item label="标准输入输出">
          <div
              v-for="(io, index) in problem.stdio"
              :key="`stdio-${id}-${index}`"
              class="mb-4 border p-2 rounded"
          >
            <el-input v-model="io.stdin" placeholder="标准输入" class="mb-1" />
            <el-input v-model="io.stdout" placeholder="标准输出" class="mb-1" />
            <el-input v-model="io.stderr" placeholder="错误输出" class="mb-1" />
            <el-button size="small" type="danger" @click="problem.stdio.splice(index, 1)">删除标准IO</el-button>
          </div>
          <el-button size="small" @click="problem.stdio.push({ stdin: '', stdout: '', stderr: '' })">添加标准IO</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleUpdateProblem(id)">保存修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
