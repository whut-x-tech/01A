# MongoDB快速上手（包会用）

## MongoDB 介绍 🐱‍💻

MongoDB 是一个开源的 **文档型数据库**，它使用类似 JSON 的 **BSON**（二进制 JSON）格式来存储数据，具有高性能、可扩展性和灵活性。它适用于各种应用程序，特别是在需要处理大量数据和快速发展的应用场景下。

![image-20250201210830480](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250201210830480.png)

###  特点 🌟

- **灵活的数据模型** 🧩  
  MongoDB 使用文档（Document）而不是表（Table）来存储数据，支持多种数据类型，便于存储复杂的嵌套数据结构。文档格式是 BSON（一种二进制格式的 JSON），支持存储数组、对象和其他嵌套结构。

- **水平扩展** 📈  
  MongoDB 支持通过 **分片**（Sharding）进行水平扩展，可以在多个机器上分布数据，提升数据存储和查询的性能。

- **高可用性** 🔄  
  通过 **副本集**（Replica Set），MongoDB 提供高可用性保障。如果某个节点失效，副本集中的其他节点可以继续提供服务，确保数据不会丢失。

- **强大的查询语言** 💬  
  MongoDB 提供丰富的查询功能，支持类似 SQL 的查询语法，支持聚合、过滤、排序等操作。还可以结合索引优化查询性能。

- **自动化管理** 🔧  
  MongoDB 提供了自动化备份、自动数据恢复、自动分片和自动故障切换等功能，使得管理大规模数据变得更容易。

### 适用场景 🏙️

MongoDB 是一个非常适合需要快速开发和灵活架构的应用程序的数据库，特别适用于以下场景：

- **实时数据分析** 📊
- **内容管理系统** (CMS) 📰
- **社交网络** 🌐
- **物联网数据存储** 📡
- **大数据应用** 📦


🚀 **推荐阅读**

- [MongoDB 官方文档](https://www.mongodb.com/docs/)
- [MongoDB 学习资源](https://www.mongodb.com/try)


### 关键点总结：
- MongoDB 是一个**文档型数据库**，使用 BSON 格式存储数据。
- 它支持**水平扩展**和**高可用性**，非常适合处理大数据和快速迭代的应用场景。
- MongoDB 提供了强大的查询和聚合功能，支持灵活的数据模型。



## MongoDB 6.0 安装 ——Ubuntu 22.04🚀

> 参考：https://dblab.xmu.edu.cn/blog/4594/

### 一、更新 Ubuntu 22.04 软件包 📦

在 Ubuntu 22.04 系统中，首先运行系统更新命令，以重建从现有仓库创建的 APT 软件包缓存。给定的命令还将更新系统中安装的软件包。

```bash
sudo apt-get update
```

接着，安装一些必要的软件包：

```bash
sudo apt-get install gnupg curl
```

### 二、添加 GPG 密钥 🔑

需要添加 GPG 密钥，系统将需要该密钥来验证我们将要安装的 MongoDB 软件包的真实性。使用以下命令添加 GPG 密钥：

```bash
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /etc/apt/trusted.gpg.d/mongodb-server-6.0.gpg --dearmor
```

### 三、添加 MongoDB 6.0 仓库 🗂️

由于 MongoDB 不能通过 Ubuntu 22.04 的默认仓库直接安装，我们需要手动添加 MongoDB 6.0 版本的仓库。执行以下命令：

```bash
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

添加仓库后，更新 APT 索引缓存：

```bash
sudo apt-get update
```

### 四、安装 libssl1.1 🔐

MongoDB 的安装需要依赖 `libssl1.1` 库，可以使用以下命令安装：

```bash
echo "deb http://security.ubuntu.com/ubuntu focal-security main" | sudo tee /etc/apt/sources.list.d/focal-security.list
sudo apt-get update
sudo apt-get install libssl1.1
```

### 五、安装 MongoDB 6.0 🛠️

现在，系统已经准备好安装 MongoDB 服务器及其其他工具（如 `mongosh`）。运行以下命令来安装 MongoDB：

```bash
sudo apt-get install mongodb-org
```

在安装过程中，会出现提示，输入 `Y` 进行确认。

### 六、启动 MongoDB 服务 🚀

启动 MongoDB 服务，并检查其状态，确保 MongoDB 正在运行：

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

![image-20250201211659147](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250201211659147.png)

### 七、进入 MongoDB Shell 🐱‍💻

在另一个终端窗口，使用以下命令进入 MongoDB Shell 交互式执行环境：

```bash
mongosh
```

![image-20250201211721079](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250201211721079.png)

在 MongoDB Shell 中，你可以输入 MongoDB 命令进行交互式操作。

要退出 MongoDB Shell，可以使用以下命令：

```bash
test> exit
```



## MongoDB 远程连接配置笔记 🌍

默认情况下，MongoDB 只允许本地连接（即来自 `127.0.0.1` 或 `localhost` 的连接）。为了允许远程机器访问 MongoDB 数据库，我们需要进行一些配置更改。本文将介绍如何在 MongoDB 中开启远程连接。

### 一、修改 MongoDB 配置文件 📝

#### 1. 打开 MongoDB 配置文件

MongoDB 的配置文件通常位于 `/etc/mongod.conf`。使用文本编辑器打开该配置文件：

```bash
sudo vim /etc/mongod.conf
```

#### 2. 修改 `bindIp` 设置

在配置文件中，找到 `net` 部分：

```yaml
net:
  port: 27017
  bindIp: 127.0.0.1
```

将 `bindIp` 设置为 `0.0.0.0`，这表示 MongoDB 将接受来自所有 IP 地址的连接。如果你只想允许特定 IP 地址连接，可以将 `bindIp` 设置为该 IP（例如，`bindIp: 127.0.0.1,<your-ip>`）。

```yaml
net:
  port: 27017
  bindIp: 0.0.0.0  # 允许所有远程连接
```

![image-20250201212138923](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250201212138923.png)

#### 3. 启用认证（如果需要）

为了增强安全性，建议启用认证，防止未经授权的访问。找到 `security` 部分，并确保 `authorization` 设置为 `enabled`：

```yaml
security:
  authorization: "enabled"
```

![image-20250201212210058](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250201212210058.png)

### 二、允许防火墙访问 MongoDB 端口 🔐

MongoDB 默认使用端口 `27017`，如果服务器启用了防火墙，需要打开该端口以允许远程连接。

#### 使用 UFW（Ubuntu 防火墙）

如果你使用的是 UFW 防火墙，可以运行以下命令允许 MongoDB 端口：

```bash
sudo ufw allow 27017
```

![image-20250201212234706](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250201212234706.png)

### 三、重启 MongoDB 服务 🔄

修改配置文件后，需要重启 MongoDB 服务以应用更改：

```bash
sudo systemctl restart mongod
```

### 四、创建管理员用户（如果尚未创建） 👤

如果你尚未创建管理员用户，并且已启用认证，必须创建一个具有足够权限的用户才能进行远程连接。

#### 1. 连接到 MongoDB shell

连接到本地 MongoDB 实例（如果你启用了认证，则需要使用管理员账户）：

```bash
mongo
```

#### 2. 切换到 `admin` 数据库并创建管理员用户

在 MongoDB shell 中，切换到 `admin` 数据库并创建一个管理员用户：

```javascript
use admin
db.createUser({
  user: "admin",
  pwd: "password",
  roles: [ { role: "root", db: "admin" } ]
})
```

#### 3. 启用认证

在配置文件中启用了认证后，MongoDB 将要求使用正确的用户名和密码进行身份验证。

### 五、通过远程客户端连接 MongoDB 🌐

在远程机器上，可以使用 MongoDB 客户端工具（如 `mongo` 或 `mongosh`）连接到 MongoDB 实例。通过以下命令连接：

```bash
mongo --host <your-server-ip> --port 27017 -u "admin" -p "your-password" --authenticationDatabase "admin"
```

> 小技巧：可以直接在linux服务器上用域名连接，如果连通了，那在远程调用的时候也一定是可以跑通的







## Spring Boot MongoDB 集成📚

### 一、引入依赖 🔗

要在 Spring Boot 项目中使用 MongoDB，需要在 `pom.xml` 中添加 MongoDB 相关的依赖。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```


### 二、配置 MongoDB 连接 🛠️

在 `application.yml` 或 `application.properties` 中配置 MongoDB 连接信息。以下是 `application.yml` 的配置示例：

```yaml
spring:
  data:
    mongodb:
      host: xxxxxxxxx       # MongoDB 的主机地址
      port: 27017           # MongoDB 端口号
      database: comment     # 默认连接的数据库
      auto-index-creation: true  # 自动创建索引
      authenticationDatabase: admin  # 认证数据库
      username: admin        # MongoDB 的用户名
      password: 050218      # MongoDB 的密码
```

## 三、MongoTemplate 使用示例 📄

`MongoTemplate` 是 Spring Data MongoDB 提供的核心类，用于执行 MongoDB 操作（如查询、插入、更新等）。

### 1. **CommentService 接口**

```java
public interface CommentService {
    void addComment(Comment comment);  // 添加评论
    List<Comment> getAllComments();    // 获取所有评论
    List<Comment> getCommentsByAgendaId(String agendaId);  // 根据议程ID查询评论
    List<Comment> getCommentsByUserId(String userId);      // 根据用户ID查询评论
    List<Comment> getCommentsByAgendaIdOrderByCreatedAt(String agendaId);  // 根据议程ID查询并按创建时间排序
}
```

### 2. **CommentServiceImpl 实现类**

```java
@Service
public class CommentServiceImpl implements CommentService {
    @Resource
    private MongoTemplate mongoTemplate;

    @Override
    public void addComment(Comment comment) {
        mongoTemplate.insert(comment);  // 插入新评论
    }

    @Override
    public List<Comment> getAllComments() {
        return mongoTemplate.findAll(Comment.class);  // 查询所有评论
    }

    @Override
    public List<Comment> getCommentsByAgendaId(String agendaId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("agendaId").is(agendaId));  // 根据 agendaId 查询
        return mongoTemplate.find(query, Comment.class);
    }

    @Override
    public List<Comment> getCommentsByUserId(String userId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(userId));  // 根据 userId 查询
        return mongoTemplate.find(query, Comment.class);
    }

    @Override
    public List<Comment> getCommentsByAgendaIdOrderByCreatedAt(String agendaId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("agendaId").is(agendaId));  // 根据 agendaId 查询
        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));  // 按 createdAt 字段降序排序
        if (mongoTemplate.exists(query, Comment.class)) {
            return mongoTemplate.find(query, Comment.class);  // 返回符合条件的评论列表
        }
        return null;  // 如果没有找到符合条件的评论，返回 null
    }
}
```

### 3. **Comment 实体类**
```java
@Document(collection = "comment")  // MongoDB 集合名称
@Data
public class Comment {
    @Id  // MongoDB 中的主键字段
    private String id;
    private String userId;      // 用户ID
    private String agendaId;    // 议程ID
    private String context;     // 评论内容
    private LocalDateTime createdAt;  // 评论创建时间
}
```

## 四、常见操作 💡

### 1. **插入数据**

在 `addComment()` 方法中，我们使用 `mongoTemplate.insert(comment)` 将新的评论插入到 MongoDB 中。

### 2. **查询数据**

使用 `mongoTemplate.find()` 方法来查询数据。可以通过 `Query` 和 `Criteria` 来构建查询条件。

- `findAll()`：查询所有文档。
- `find()`：根据查询条件查询特定文档。
- `exists()`：检查是否存在符合条件的文档。

### 3. **排序**

通过 `query.with(Sort.by(Sort.Direction.DESC, "createdAt"))` 对查询结果进行排序，这里我们按 `createdAt` 字段降序排序。

## 五、启动与测试 🚀

确保你已经正确配置了 MongoDB，并且 MongoDB 服务已经启动。然后，你可以使用 Spring Boot 启动项目，通过 REST API 或直接调用服务方法来测试 MongoDB 操作。

- 使用 `@Service` 注解将 `CommentServiceImpl` 类标记为服务类。
- 在控制器层（Controller）或其他地方调用 `CommentService` 的方法来进行数据操作。



### 示例：调用 `getCommentsByAgendaIdOrderByCreatedAt`

```java
@RestController
@RequestMapping("/comments")
public class CommentController {
    
    @Autowired
    private CommentService commentService;

    @GetMapping("/agenda/{agendaId}")
    public List<Comment> getCommentsByAgendaId(@PathVariable String agendaId) {
        return commentService.getCommentsByAgendaIdOrderByCreatedAt(agendaId);
    }
}
```

![image-20250201212839986](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250201212839986.png)
<Artalk />