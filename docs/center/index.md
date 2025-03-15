# ⚙️ 中间件技术中心

聚焦企业级中间件技术栈，提供从基础到进阶的实战指南。

## 🗂 技术矩阵
```card-grid
  - title: MongoDB
    link: /center/MongoDB-fast
    icon: 🍃
    desc: 快速上手文档数据库
    theme: #47A248
  - title: RabbitMQ
    link: /center/rabbitmq-base
    icon: 🐇
    desc: 消息队列核心模式解析
    theme: #FF6600
  - title: 权限控制
    link: /center/auth
    icon: 🔒
    desc: 主流鉴权方案对比
    theme: #1E90FF
```

## 🛠️ 实战专题
| 技术领域 | 关键内容 | 关联文档 |
|---------|----------|----------|
| **消息队列** | 五种模式实现 | <mcsymbol name="rabbitmq-sb" filename="config.mjs" path="/usr/app/front/x-tech/x-tech.github.io/docs/.vitepress/config.mjs" startline="78" type="function"></mcsymbol> |
| **安全控制** | RBAC模型解析 | [RBAC权限控制](/center/RBAC) |
| **框架整合** | Spring Security | [学习笔记](/center/springSecurity1) |

::: tip 学习建议
1. 从<mcsymbol name="MongoDB-fast" filename="config.mjs" path="/usr/app/front/x-tech/x-tech.github.io/docs/.vitepress/config.mjs" startline="77" type="function"></mcsymbol>开始掌握基础
2. 结合<mcfile name="config.mjs" path="/usr/app/front/x-tech/x-tech.github.io/docs/.vitepress/config.mjs"></mcfile>中的技术栈配置
3. 遵循「理论→配置→实战」三阶段学习法
:::

## 📌 注意事项
```checklist
- [ ] 所有示例基于SpringBoot 3.x
- [ ] 需要预装Docker运行环境
- [ ] 生产环境配置需参考官方文档
```



<Badge type="info" text="最后更新：2024-05-20" />
<Badge type="warning" text="推荐Docker 24.0+" />


### 关键配置点：
1. **动态路由绑定**：所有链接均使用绝对路径 `/center/` 开头
2. **符号关联**：通过 `<mcsymbol>` 精确关联到配置文件中的路由定义
3. **版本一致性**：明确标注技术栈版本要求
4. **组件复用**：延续项目的 card-grid/mermaid/checklist 组件规范
<Artalk />