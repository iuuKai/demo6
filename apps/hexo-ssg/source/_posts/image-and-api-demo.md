---
title: monorepo hexo-ssg 本地图片引入测试
date: 2024-01-20
categories:
  - 演示
tags:
  - 图片
  - Hexo
  - 测试
---

> 测试本地图片引入功能。

## 测试图片

根目录图片：

![测试图片](demo.jpg)

使用 asset_img 标签引入：

{% asset_img demo2.jpg "测试图片" %}

## hexo-asset-link 插件

`hexo-asset-link` 是一个 Hexo 插件，用于增强文章资源管理功能：

- **作用**：确保使用 `{% asset_img %}` 标签引用的图片路径能正确带上 `root`（baseurl）前缀
- **安装**：`pnpm add hexo-asset-link --save`
- **配置**：在 `_config.yml` 中设置 `post_asset_folder: true`

## 测试说明

- 图片放置在文章资源文件夹中（`source/_posts/文章名/`）
- 使用 `{% asset_img 文件名 "说明" %}` 标签引用
- 支持 baseurl 前缀自动处理（开发环境 `/`，生产环境 `/hexo-ssg/`）

## 官方文档

更多信息请参考 Hexo 官方文档：[资源文件夹](https://hexo.io/zh-cn/docs/asset-folders)

## 测试结果

✅ 图片引入成功
