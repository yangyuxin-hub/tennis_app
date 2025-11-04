# 🎾 网球社交平台

一个专注于网球爱好者的移动社交应用，提供动态分享、约球组局等核心功能。

## 📱 项目简介

网球社交平台旨在构建活跃的网球社交生态圈，让网球爱好者能够轻松找到球友、分享动态、组织约球活动。

## 🛠 技术栈

### 前端
- **框架**: Expo SDK 54 (Managed Workflow)
- **语言**: TypeScript
- **UI 库**: React Native
- **状态管理**: Zustand
- **导航**: React Navigation
- **API 请求**: Axios

### 后端（计划中）
- **框架**: FastAPI + Python
- **数据库**: PostgreSQL (云 RDS)
- **ORM**: SQLAlchemy
- **认证**: JWT

## 📁 项目结构

```
tennis_app/
├── mobile/              # 前端移动应用
│   ├── src/            # 源代码
│   ├── assets/         # 静态资源
│   └── App.tsx         # 应用入口
├── backend/            # 后端服务（计划中）
└── 项目介绍/           # 项目文档
```

详细结构说明请查看 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🚀 快速开始

### 前端开发

```bash
cd mobile
npm install
npm start
```

然后在 Expo Go 中扫描二维码即可。

### 后端开发（计划中）

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## ✨ 已实现功能

### 认证模块
- ✅ 用户登录
- ✅ 用户注册
- ✅ 忘记密码流程
- ✅ Token 管理和自动刷新

### UI 组件
- ✅ Button（多种变体）
- ✅ Input（带错误提示）
- ✅ PasswordInput（密码强度检测）

### 设计系统
- ✅ 颜色规范（基于 Figma）
- ✅ 字体规范
- ✅ 间距规范

## 📚 文档

- [项目结构说明](./PROJECT_STRUCTURE.md)
- [技术实践路径](./项目介绍/技术实践路径.md)
- [项目介绍](./项目介绍/项目介绍.md)
- [用户登录系统设计](./项目介绍/用户登录系统设计文档.md)
- [Figma 设计索引](./项目介绍/Tennis-Frog设计索引.md)

## 🎨 设计

所有设计基于 Figma：
- [查看设计文件](https://www.figma.com/design/XBUIg5DVwkoLkDFk3FEuRO/Tennis-Frog)

## 📝 开发计划

### 第一阶段：核心功能
- [ ] 首页动态流
- [ ] 发布动态
- [ ] 约球功能
- [ ] 个人中心

### 第二阶段：社交功能
- [ ] 评论互动
- [ ] 点赞收藏
- [ ] 关注系统
- [ ] 聊天功能

## 📄 许可证

待定

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**开发中** 🚧

