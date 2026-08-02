---
title: Hexo 使用指南
date: 2024-01-15
categories:
  - 技术
tags:
  - Hexo
  - 静态网站
  - 博客
---

# Hexo 使用指南

Hexo 是一个快速、简洁且高效的静态网站生成框架。

## 什么是 Hexo

Hexo 是基于 Node.js 的静态博客框架，具有以下特点：

- **快速**：使用 Node.js 渲染，生成速度极快
- **简洁**：使用 Markdown 写作，无需关心格式
- **灵活**：支持多种主题和插件

## 安装 Hexo

```bash
$ npm install -g hexo-cli
$ hexo init my-blog
$ cd my-blog
$ npm install
```

## 创建文章

```bash
$ hexo new "My New Post"
```

## 运行服务器

```bash
$ hexo server
```

## 生成静态文件

```bash
$ hexo generate
```

## 部署

```bash
$ hexo deploy
```

## 常用命令

| 命令            | 描述           |
| --------------- | -------------- |
| `hexo new`      | 创建新文章     |
| `hexo server`   | 启动开发服务器 |
| `hexo generate` | 生成静态文件   |
| `hexo deploy`   | 部署到服务器   |

## 总结

Hexo 是一个非常优秀的静态网站生成器，适合个人博客、项目文档等场景。
