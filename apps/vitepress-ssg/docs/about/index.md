# 关于

<div>
  <h1>About</h1>
  <div class="user-list">
    <div class="loading" v-if="isLoading">
      <span v-if="isProduction">加载中...</span>
      <span v-else>请运行 vercel dev 或者部署到 vercel 上查看</span>
    </div>
    <template v-else>
      <ul v-if="userList.length > 0">
        <li v-for="user in userList" :key="user.id">{{ user.name }} - {{ user.email }}</li>
      </ul>
      <div v-else class="empty">暂无用户</div>
    </template>
  </div>
</div>

<script setup>
import { ref, onBeforeMount } from 'vue'

const isProduction = import.meta.env.MODE === 'production'
const userList = ref([])
const isLoading = ref(true)

onBeforeMount(async () => {
	if (isProduction) {
		userList.value = await fetch('/api/user/all')
			.then(res => res.json())
			.then(res => {
				isLoading.value = false
				return res.data || []
			})
	}
})
</script>

<style scoped>
.user-list {
	overflow-y: auto;
	max-height: 300px;
}
.user-list ul li {
	line-height: 40px;
}
</style>
