## springSecurity入门

> （本文适合从未接触过spring security的同学快速上手体验）

### 介绍

**Spring Security** 是一个功能强大且高度可定制的安全框架，专门为基于 Spring 的应用程序提供身份验证（Authentication）和授权（Authorization）支持。它是 Spring 生态系统的一部分，广泛应用于保护 Java 应用程序，尤其是 Web 应用程序。

#### 核心功能

1. **身份验证**：验证用户身份（如用户名和密码）。
2. **授权**：控制用户访问资源的权限。
3. **防护攻击**：防止常见的安全攻击，如 CSRF、会话固定等。
4. **集成**：与 Spring 框架无缝集成，支持 OAuth2、LDAP、JWT 等现代安全技术。



### 下载案例：Spring Security 入门实践

#### 1. 下载 Demo
首先，我们从阿里云的 Spring Boot 初始化工具下载一个基础项目模板。访问以下链接：
[阿里云 Spring Initializr](https://start.aliyun.com/)

在页面中，选择与下图相同的配置：
- **Spring Boot 版本**：2.7.x
- **依赖**：Spring Web、Spring Security、MySQL Driver

![阿里云初始化工具配置](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250113002645539.png)

#### 2. 导入项目到 IDEA
下载完成后，将项目解压并导入到 IntelliJ IDEA 中。如果初次运行时未连接数据库，可以暂时注释掉 `application.properties` 或 `application.yml` 中的 JDBC 连接配置，以避免启动失败。

#### 3. 运行项目
启动项目后，控制台会输出 Spring Security 自动生成的默认用户信息，如下图所示：

![项目启动成功](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250113002905543.png)

红框部分显示的是 Spring Security 自动生成的默认用户名和密码。默认用户名为 `user`，密码为控制台输出的一串随机字符串。

#### 4. 测试 Spring Security 的保护机制
为了验证 Spring Security 的默认保护机制，我们编写一个简单的测试接口：

```java
package top.miqiu.security.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/login2")
    public String login() {
        return "login";
    }
}
```

启动项目后，访问 `http://localhost:8080/login2`，会发现 Spring Security 自动拦截了该请求，并跳转到默认的登录页面：

![Spring Security 登录页面](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250113003157980.png)

#### 5. 默认用户与登录
Spring Security 在启动时会自动生成一个默认用户：
- **用户名**：`user`
- **密码**：控制台输出的随机字符串

使用默认用户登录后，即可访问受保护的资源 `/login2`。





### 修改 Spring Security 默认密码

在 Spring Security 中，默认情况下会生成一个随机密码，但我们可以通过配置文件自定义用户名和密码，以便更方便地管理和使用。

---

#### 1. 通过配置文件修改默认密码

在 `application.properties` 或 `application.yml` 中，添加以下配置来设置自定义的用户名和密码：

**`application.properties` 配置：**
```properties
spring.security.user.name=admin
spring.security.user.password=123456
```

**`application.yml` 配置：**
```yaml
spring:
  security:
    user:
      name: admin
      password: 123456
```

---

#### 2. 重启项目并验证

修改配置文件后，重启项目。此时，控制台将不再输出随机生成的密码，而是使用我们在配置文件中设置的用户名和密码。

![控制台无随机密码](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250113004036939.png)

---

#### 3. 使用自定义账号登录

访问受保护的资源（如 `/login2`），Spring Security 会跳转到登录页面。输入配置文件中设置的用户名和密码：

- **用户名**：`admin`
- **密码**：`123456`

登录成功后，即可访问受保护的资源：

![登录成功](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250113004218691.png)

---











<Artalk />