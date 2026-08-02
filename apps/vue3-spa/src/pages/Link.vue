<template>
	<div class="link">
		<h2>User List</h2>
		<ul v-if="users.length" class="user-list">
			<li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</li>
		</ul>
		<div v-else class="error-tip">
			{{ errorMsg || '加载中...' }}
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const errorMsg = ref('')

onMounted(async () => {
	try {
		const res = await axios.get('/api/user/all')
		// 检查接口返回结构
		if (res.data && Array.isArray(res.data.data)) {
			users.value = res.data.data
		} else {
			errorMsg.value = '请求失败'
		}
	} catch (err) {
		console.error('请求失败', err)
		errorMsg.value = '请求失败'
	}
})
</script>

<style scoped>
.user-list {
	margin-top: 20px;
	list-style: none;
}

.user-list li {
	padding: 10px 0;
	border-bottom: 1px solid #ccc;
}

.error-tip {
	margin-top: 20px;
	color: #ff4d4f;
	font-weight: 500;
}
</style>
