# Link

## User List

<div class="link-container">
  <div v-if="isLoading" class="loading">
    <span>加载中...</span>
  </div>

  <template v-else>
    <ul v-if="userList.length > 0" class="user-list">
      <li v-for="user in userList" :key="user.id">
        {{ user.name }} — {{ user.email }}
      </li>
    </ul>
    <div v-else class="empty">暂无用户数据</div>
  </template>
</div>

<script setup>
import { ref, onMounted } from 'vue'

// 环境判断
const isProduction = import.meta.env.MODE === 'production'

// 响应式数据
const userList = ref([])
const isLoading = ref(true)

// 仅在客户端挂载后请求数据（避免 SSR 报错）
onMounted(async () => {
  try {
    isLoading.value = true
    const res = await fetch('/api/user/all')
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    userList.value = data.data || data // 兼容两种返回结构
  } catch (err) {
    console.error('获取用户列表失败:', err)
    userList.value = []
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.link-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.loading {
  color: #666;
  font-size: 1.1rem;
  padding: 2rem 0;
  text-align: center;
}
.user-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}
.user-list li {
  padding: 0.8rem 0;
  border-bottom: 1px solid #eee;
  font-size: 1.05rem;
}
.empty {
  color: #999;
  padding: 2rem 0;
  text-align: center;
}
</style>
