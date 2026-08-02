<template>
	<div class="app-container">
		<!-- 统一导航 -->
		<nav class="nav">
			<router-link to="/">Home</router-link>
			<router-link to="/about">About</router-link>
			<router-link to="/link">Link</router-link>
		</nav>

		<!-- 页面内容 -->
		<div class="page-content">
			<router-view />
		</div>
	</div>
</template>

<script setup></script>

<style></style>
