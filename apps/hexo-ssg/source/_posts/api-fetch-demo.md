---
title: monorepo hexo-ssg 接口请求测试
date: 2024-01-21
categories:
  - 演示
tags:
  - API
  - JavaScript
  - 测试
---

> 测试前端 JavaScript 调用 API 并渲染数据功能。

## 测试目标

调用 `/api/user/all` 接口获取用户数据并渲染到页面。

## 测试结果

<div id="user-list-container">
  <h4 style="margin-bottom: 10px; color: #333;">用户列表</h4>
  <div id="users-list" style="min-height: 40px; padding: 5px;">
    <span style="color: #999;">加载中...</span>
  </div>
</div>

<style>
#user-list-container {
  border-radius: 6px;
  padding: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  margin: 3px 0;
  background: #fff;
  border-radius: 4px;
  font-size: 13px;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.user-email {
  color: #666;
  font-size: 12px;
}
</style>

<script>
async function loadUsers() {
  const container = document.getElementById('users-list');
  
  try {
    const response = await fetch('/api/user/all');
    const res = await response.json();
    
    const users = res.data || res;
    
    if (users && users.length > 0) {
      const html = users.map(user => `
        <div class="user-item">
          <span class="user-name">${user.name || '未知用户'}</span>
          <span class="user-email">${user.email || '-'}</span>
        </div>
      `).join('');
      
      container.innerHTML = html;
    } else {
      container.innerHTML = '<span style="color: #999;">暂无数据</span>';
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    container.innerHTML = '<span style="color: #dc3545;">加载失败</span>';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadUsers);
} else {
  loadUsers();
}
</script>

## 测试说明

- 使用 fetch API 调用后端接口
- 支持 `res.data` 和直接数组两种数据格式
- 自动处理页面加载状态
- 包含错误处理机制
