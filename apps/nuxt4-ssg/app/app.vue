<template>
	<div class="app-container">
		<nav class="nav">
			<NuxtLink to="/" active-class="active">Home</NuxtLink>
			<NuxtLink to="/about" active-class="active">About</NuxtLink>
			<NuxtLink to="/link" active-class="active">Link</NuxtLink>
		</nav>

		<div class="page-content">
			<NuxtPage />
		</div>
	</div>
</template>

<script setup></script>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: system-ui, sans-serif;
}
.app-container {
	min-height: 100vh;
	background: #fcffca;
	padding: 30px 20px;
}
.nav {
	display: flex;
	gap: 20px;
	margin-bottom: 30px;
	font-size: 18px;
}
.nav a {
	text-decoration: none;
	color: #1677ff;
	font-weight: 500;
	cursor: pointer;
}
.nav a:hover {
	color: #0958d9;
}
.page-content {
	max-width: 800px;
	margin: 0 auto;
}
</style>
