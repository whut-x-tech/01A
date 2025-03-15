# RBAC 权限控制模型学习

## 1. 什么是 RBAC？

RBAC（Role-Based Access Control，基于角色的访问控制）是一种权限管理模型，通过将权限分配给角色，再将角色分配给用户，来实现对系统资源的访问控制。RBAC 的核心思想是将用户与权限分离，通过角色作为中间层来管理权限。

## 2. RBAC 的核心概念

### 2.1 用户（User）
- 系统中的个体，可以是人、设备或其他实体。
- 用户通过被分配角色来获得权限。

#### 用户表如下

```mysql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
    email VARCHAR(100) COMMENT '邮箱',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='用户表';
```



### 2.2 角色（Role）

- 一组权限的集合。
- 角色可以分配给一个或多个用户。
- 例如：管理员、编辑、访客等。

#### 角色表如下

```mysql
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
    role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
    description VARCHAR(255) COMMENT '角色描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='角色表';
```



### 2.3 权限（Permission）

- 对系统资源的操作权限。
- 例如：读取文件、写入数据库、删除记录等。

权限表如下

```mysql
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '权限ID',
    permission_name VARCHAR(100) NOT NULL UNIQUE COMMENT '权限名称',
    description VARCHAR(255) COMMENT '权限描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='权限表';
```

### 2.4 会话（Session）
- 用户与系统之间的交互过程。
- 用户在会话中激活一个或多个角色，从而获得相应的权限。



## 3. RBAC 的核心模型（Core RBAC）

- 用户、角色、权限之间的关系。
- 用户与角色之间是多对多的关系。
- 角色与权限之间也是多对多的关系。

#### 用户角色关联表

```mysql
CREATE TABLE user_roles (
    user_id INT NOT NULL COMMENT '用户ID',
    role_id INT NOT NULL COMMENT '角色ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) COMMENT='用户角色关联表';
```

#### 角色权限关联表

```mysql
CREATE TABLE role_permissions (
    role_id INT NOT NULL COMMENT '角色ID',
    permission_id INT NOT NULL COMMENT '权限ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) COMMENT='角色权限关联表';
```

## 4. RBAC 的应用场景

- **企业管理系统**：如 ERP、CRM 系统，不同部门有不同的权限需求。
- **云服务平台**：如 AWS、Azure，用户通过角色来管理云资源。
- **内容管理系统**：如 WordPress，不同用户角色有不同的内容管理权限。

## 5.参考文献

- [NIST RBAC 标准](https://csrc.nist.gov/projects/role-based-access-control)
- [RBAC 维基百科](https://en.wikipedia.org/wiki/Role-based_access_control)

<Artalk />