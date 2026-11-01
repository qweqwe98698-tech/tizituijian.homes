---
title: 'Clash Verge Rev 从零上手教程：2026 订阅导入、规则分流与 TUN 模式详解'
category: 'budget'
pubDate: 2026-09-28
description: '针对新手用户的现代 Clash 客户端完整配置教程，涵盖一键导入、延迟测试、策略组配置与全局虚拟网卡设置。'

---

伴随原版 Clash for Windows 项目停止维护，基于开源 Mihomo 内核深度优化的 **Clash Verge Rev** 已成为当前 Windows 与 macOS 平台最受推崇的桌面代理客户端。

## 一、软件下载与安装

访问本站的 [客户端指南](/clients) 或前往 Clash Verge Rev 官方 GitHub Releases 页面，根据您的操作系统下载对应安装包：
- Windows 64位系统：下载 `Clash.Verge_x.x.x_x64-setup.exe`
- Mac Apple Silicon (M1/M2/M3/M4)：下载 `Clash.Verge_x.x.x_aarch64.dmg`

## 二、订阅链接导入与节点激活

1. 登录您所购买的机场后台（如 [光速云](/work/guangsu) 或 [微风网络](/work/weifeng)），复制 **Clash 通用订阅链接**。
2. 打开 Clash Verge Rev，在左侧导航栏点击 **「订阅 (Profiles)」**。
3. 在顶部输入框粘贴订阅地址，点击 **「导入 (Import)」**。
4. 导入成功后，选中该订阅配置，指示灯变绿即代表配置加载成功。

## 三、开启系统代理与 TUN 模式

1. 点击左侧 **「代理 (Proxies)」**，在策略组中选择延迟最低的节点（可点击右上角测速闪电图标进行批量测速）。
2. 在左侧 **「设置 (Settings)」** 中开启 **「系统代理 (System Proxy)」**，即可畅游外网。
3. **进阶必开**：开启 **「TUN 模式」**（需管理员权限授权），即可让游戏客户端、命令行工具等所有软件全局无感走代理。
