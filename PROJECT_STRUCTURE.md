# 📁 网球社交平台 - 项目结构说明

## 🎯 项目概览

这是一个全栈网球社交平台项目，采用前后端分离架构：
- **前端**: Expo + React Native (TypeScript)
- **后端**: FastAPI + Python (计划中)
- **数据库**: PostgreSQL

---

## 📂 完整项目结构

```
tennis_app/
├── mobile/                    # 📱 前端移动应用（Expo + React Native）
│   ├── src/                  # 源代码目录
│   │   ├── components/       # 通用组件
│   │   ├── screens/          # 页面组件
│   │   ├── navigation/      # 导航配置
│   │   ├── services/         # API 服务
│   │   ├── store/           # 状态管理
│   │   ├── design-tokens/   # 设计规范
│   │   └── config/          # 配置文件
│   ├── assets/              # 静态资源
│   ├── App.tsx              # 应用入口
│   ├── app.json             # Expo 配置
│   └── package.json         # 依赖配置
│
├── backend/                  # 🚀 后端服务（FastAPI + Python）[计划中]
│   ├── app/
│   │   ├── api/             # API 路由
│   │   ├── models/          # 数据模型
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # 业务逻辑
│   │   ├── core/            # 核心配置
│   │   ├── db/              # 数据库配置
│   │   └── utils/           # 工具函数
│   ├── alembic/             # 数据库迁移
│   ├── tests/               # 测试文件
│   └── main.py              # 应用入口
│
└── 项目介绍/                 # 📚 项目文档
    ├── 项目介绍.md          # 项目概述
    ├── 技术实践路径.md      # 技术栈和开发指南
    ├── Tennis-Frog设计索引.md # Figma 设计对照
    ├── 用户登录系统设计文档.md # 登录系统详细设计
    └── 用户登录系统流程图.md # 流程图说明
```

---

## 📱 前端结构详解 (mobile/)

### 1. `src/components/` - 通用组件

可复用的 UI 组件，遵循单一职责原则。

```
components/
└── common/
    ├── Button.tsx           # 按钮组件（支持多种变体）
    ├── Input.tsx            # 文本输入框组件
    └── PasswordInput.tsx    # 密码输入框（带显示/隐藏、强度检测）
```

**职责**:
- 提供可复用的 UI 组件
- 遵循设计系统规范
- 统一组件 API

### 2. `src/screens/` - 页面组件

应用的主要页面，按功能模块组织。

```
screens/
└── auth/                    # 认证模块
    ├── LoginScreen.tsx      # 登录页面
    ├── RegisterScreen.tsx  # 注册页面
    └── ForgotPasswordScreen.tsx # 忘记密码流程
```

**职责**:
- 实现完整的页面功能
- 处理用户交互
- 调用服务层 API

**规划中的页面**:
- `feed/` - 动态流页面
- `matches/` - 约球页面
- `profile/` - 个人中心
- `chat/` - 聊天页面
- `notifications/` - 通知页面

### 3. `src/navigation/` - 导航配置

使用 React Navigation 管理应用导航。

```
navigation/
├── AppNavigator.tsx         # 主导航（根据认证状态切换）
├── AuthNavigator.tsx        # 认证相关页面导航
└── MainNavigator.tsx        # 主应用导航（底部标签）
```

**职责**:
- 配置路由结构
- 管理导航状态
- 处理深层链接

### 4. `src/services/` - API 服务

封装所有 API 调用，统一处理请求和响应。

```
services/
├── api.ts                   # Axios 客户端配置
└── authService.ts           # 认证相关 API
```

**职责**:
- 配置 HTTP 客户端
- 实现 API 调用方法
- 处理 Token 刷新
- 统一错误处理

**api.ts 功能**:
- Axios 实例配置
- 请求拦截器（添加 Token）
- 响应拦截器（处理 401，自动刷新 Token）

**authService.ts 方法**:
- `login()` - 用户登录
- `register()` - 用户注册
- `forgotPassword()` - 忘记密码
- `resetPassword()` - 重置密码
- `logout()` - 用户登出
- `getCurrentUser()` - 获取当前用户

### 5. `src/store/` - 状态管理

使用 Zustand 进行全局状态管理。

```
store/
└── authStore.ts             # 认证状态管理
```

**authStore 状态**:
- `user` - 当前用户信息
- `token` - Access Token
- `refreshToken` - Refresh Token
- `isAuthenticated` - 认证状态
- `isLoading` - 加载状态

**authStore 方法**:
- `login()` - 登录并保存状态
- `logout()` - 登出并清除状态
- `setToken()` - 设置 Token
- `initialize()` - 从本地存储恢复状态

### 6. `src/design-tokens/` - 设计规范

统一的设计系统，基于 Figma 设计文件。

```
design-tokens/
├── colors.ts                # 颜色规范
├── typography.ts            # 字体规范
├── spacing.ts               # 间距和圆角规范
└── index.ts                 # 统一导出
```

**colors.ts**:
- `primary` - 主色调（深绿色 #274125）
- `secondary` - 辅助色（网球绿）
- `gray` - 灰度色
- `background` - 背景色
- `text` - 文本色
- `status` - 状态色（成功/错误/警告）

**typography.ts**:
- `h1`, `h2`, `h3` - 标题样式
- `body`, `bodySmall` - 正文样式
- `caption` - 说明文字
- `button` - 按钮文字

**spacing.ts**:
- `spacing` - 间距系统（xs, sm, md, lg, xl, xxl）
- `radius` - 圆角系统（sm, md, lg, full）

### 7. `src/config/` - 配置文件

应用配置信息。

```
config/
└── api.ts                   # API 配置
```

**api.ts**:
- `BASE_URL` - API 基础地址
- `TIMEOUT` - 请求超时时间
- 根据 `__DEV__` 自动切换开发/生产环境

---

## 🚀 后端结构（计划中）

### `backend/app/` - 应用核心

```
app/
├── api/                     # API 路由
│   ├── auth.py             # 认证路由
│   ├── posts.py            # 动态路由
│   ├── matches.py          # 约球路由
│   └── users.py            # 用户路由
│
├── models/                  # 数据模型（SQLAlchemy）
│   ├── user.py             # 用户模型
│   ├── post.py             # 动态模型
│   └── match.py            # 约球模型
│
├── schemas/                 # Pydantic 数据验证
│   ├── user.py             # 用户 Schema
│   ├── post.py             # 动态 Schema
│   └── match.py            # 约球 Schema
│
├── services/                # 业务逻辑层
│   ├── auth.py             # 认证服务
│   ├── post.py             # 动态服务
│   └── match.py            # 约球服务
│
├── core/                    # 核心配置
│   ├── config.py           # 应用配置
│   └── security.py         # 安全工具（JWT, Bcrypt）
│
├── db/                      # 数据库配置
│   └── database.py         # 数据库连接和会话管理
│
└── utils/                   # 工具函数
    ├── email.py            # 邮件发送
    └── sms.py              # 短信发送
```

---

## 📚 文档结构 (项目介绍/)

### 核心文档

1. **项目介绍.md**
   - 项目概述
   - 核心功能说明
   - 技术架构
   - 数据模型
   - 商业模式

2. **技术实践路径.md**
   - 技术栈详细说明
   - 开发环境配置
   - 项目初始化步骤
   - 前后端开发实践
   - 部署指南

3. **Tennis-Frog设计索引.md**
   - Figma 设计文件索引
   - 设计页面总览
   - 设计系统规范
   - 组件库说明
   - 开发优先级

4. **用户登录系统设计文档.md**
   - 登录系统详细设计
   - API 接口文档
   - 数据库设计
   - 安全机制
   - 实现指南

5. **用户登录系统流程图.md**
   - 完整的流程图（Mermaid）
   - 各个功能的流程说明
   - 数据流向图
   - Token 生命周期

---

## 🔄 数据流向

### 前端数据流

```
用户操作
  ↓
Screen 组件
  ↓
调用 authService
  ↓
api.ts (Axios)
  ↓
后端 API
  ↓
响应数据
  ↓
更新 authStore
  ↓
UI 自动更新
```

### 认证流程

```
1. 用户输入 → Screen
2. Screen → authService.login()
3. authService → api.ts (POST /api/auth/login)
4. 后端验证 → 返回 Token
5. authService → authStore.login()
6. authStore → AsyncStorage (持久化)
7. AppNavigator → 检测 isAuthenticated
8. 导航到主页面
```

---

## 📦 依赖管理

### 前端依赖 (package.json)

**核心框架**:
- `expo@~54.0.0` - Expo SDK
- `react@19.1.0` - React 库
- `react-native@0.81.5` - React Native

**导航**:
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`
- `react-native-gesture-handler`
- `react-native-screens`
- `react-native-safe-area-context`

**状态管理**:
- `zustand@^4.4.7`

**工具库**:
- `axios@^1.6.2` - HTTP 客户端
- `@react-native-async-storage/async-storage` - 本地存储
- `@expo/vector-icons` - 图标库

### 后端依赖（计划）

**核心框架**:
- `fastapi@~0.104.1`
- `uvicorn` - ASGI 服务器

**数据库**:
- `sqlalchemy@~2.0.23` - ORM
- `psycopg2-binary` - PostgreSQL 驱动
- `alembic` - 数据库迁移

**认证**:
- `python-jose[cryptography]` - JWT
- `passlib[bcrypt]` - 密码加密

---

## 🎨 设计系统

### 设计规范来源

所有设计规范都基于 Figma 设计文件：
- **文件 Key**: `XBUIg5DVwkoLkDFk3FEuRO`
- **设计链接**: [Tennis-Frog](https://www.figma.com/design/XBUIg5DVwkoLkDFk3FEuRO/Tennis-Frog)

### 颜色系统

- **主色**: `#274125` (深绿色)
- **辅助色**: `#7CB342` (网球绿)
- **背景**: `#FFFFFF`, `#F5F5F5`
- **文本**: `#000000`, `#666666`

### 组件对照

| 功能 | Figma 页面 | 代码文件 |
|------|-----------|---------|
| 登录 | 03-01 ~ 03-04 | LoginScreen.tsx |
| 注册 | 05-01 ~ 05-05 | RegisterScreen.tsx |
| 忘记密码 | 04-01 ~ 04-06 | ForgotPasswordScreen.tsx |

---

## 🚦 开发流程

### 添加新功能

1. **设计确认** - 查看 Figma 设计文件
2. **创建组件** - 在 `components/` 或 `screens/` 中创建
3. **API 集成** - 在 `services/` 中添加 API 方法
4. **状态管理** - 在 `store/` 中添加状态（如需要）
5. **导航配置** - 在 `navigation/` 中添加路由
6. **测试** - 在 Expo Go 中测试

### 代码规范

- **命名**: 使用 PascalCase（组件）和 camelCase（函数/变量）
- **文件组织**: 按功能模块组织
- **导入顺序**: 
  1. React/React Native
  2. 第三方库
  3. 本地组件/服务
  4. 类型定义
- **组件结构**:
  ```typescript
  // 1. 导入
  // 2. 类型定义
  // 3. 组件实现
  // 4. 样式定义
  // 5. 导出
  ```

---

## 📝 配置文件说明

### mobile/app.json

Expo 应用配置：
- 应用名称和版本
- 图标和启动页配置
- 平台特定配置（iOS/Android）
- Bundle ID/Package Name

### mobile/tsconfig.json

TypeScript 配置：
- 编译选项
- 路径别名配置
- 类型检查规则

### mobile/.npmrc

npm 配置：
- `legacy-peer-deps=true` - 解决 React 19 依赖冲突

### mobile/.gitignore

Git 忽略规则：
- `node_modules/`
- `.expo/`
- 构建产物
- 环境变量文件

---

## 🔍 关键文件说明

### App.tsx

应用入口文件，关键点：
- **必须在最顶部导入** `react-native-gesture-handler`
- 初始化导航系统
- 配置全局状态

### src/navigation/AppNavigator.tsx

主导航组件：
- 根据 `isAuthenticated` 状态切换导航
- 处理应用启动时的状态恢复
- 显示加载动画

### src/services/api.ts

API 客户端核心：
- 统一配置请求基础 URL
- 自动添加 Authorization Header
- 自动处理 Token 刷新
- 统一错误处理

---

## 🎯 下一步开发计划

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

### 第三阶段：完善功能
- [ ] 通知系统
- [ ] 设置页面
- [ ] 搜索功能
- [ ] 性能优化

---

**文档版本**: v1.0  
**最后更新**: 2025-11-04

