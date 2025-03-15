## 几种用户鉴权的方式对比

最近也要准备秋招，刚好整理下前后端一般采用的几种鉴权方式。

### 一、传统用户鉴权

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/传统用户鉴权.png" alt="传统用户鉴权" style="zoom: 25%;" />

#### 详细步骤

1. **用户登录**
   - 用户通过前端提交用户名和密码到后端服务器，后端服务器验证用户名和密码是否正确。
   - 如果验证成功，后端生成一个 **session**（会话），并将其保存在服务器端。
2. **Session存储**
   - 后端会将该用户的会话信息保存在服务器的内存或数据库中，或者通过 Redis 等缓存系统，每个用户的会话都会与一个唯一的 **Session ID** 绑定，并通过 Cookie 发送到浏览器。
   - 浏览器会将 **Session ID** 存储在 **Cookie** 中，每次请求时，都会自动将该 Cookie 附带到请求头中发送给服务器。
3. **Session验证**
   - 每次用户发起请求时，浏览器都会携带上次登录时存储的 **Session ID**，后端服务器根据请求中的 **Session ID** 来查找对应的会话信息，验证用户是否已登录。
   - 如果 Session 存在且有效，则认为用户已经登录，可以继续访问相关资源；如果 Session 不存在或失效，则需要用户重新登录。
4. **用户登出**
   - 用户主动登出时，前端会向后端发送请求，后端会清除该用户的 **Session**。
   - 服务器会删除该 Session 数据，浏览器中的 **Session ID** 也会失效。

#### 优势

- **架构清晰，易于理解**：传统的 Session 认证非常直接，登录时会话存储简单，验证方式清晰。
- **易于实现**：适合小型应用，尤其是没有复杂分布式需求的场景。
- **安全性相对较高**：会话存储在服务器端，不容易受到 XSS 攻击的影响。
- **不需要存储敏感信息在客户端**：用户的敏感信息（如密码）不会直接暴露在客户端。

#### 缺点

1. **不适用于集群环境**
   - 当应用部署到多个服务器时，每台服务器的 **Session** 数据是独立的，因此无法在不同服务器间共享 Session。在集群中，用户切换服务器时，可能会导致会话丢失（例如，用户登录在服务器 A 上，切换到服务器 B 后发现 Session 失效）。
   - 解决这个问题通常需要使用 **分布式缓存（如 Redis）** 来存储 Session，保证集群环境下 Session 的共享。
2. **“一处登录，处处登录”难以实现**
   - 传统的 Session 机制通常是单一服务器的，会话仅在该服务器有效。若多个服务器部署，无法保证用户在多个地方登录时的统一状态。
   - 这种需求可以通过 **单点登录（SSO）** 或通过共享的会话存储解决，但实现起来会复杂一些。
3. **性能问题**
   - 会话信息的存储（特别是存储在内存中）可能会占用大量资源。如果用户量非常大，服务器的内存可能会成为瓶颈。
   - 尤其在高并发场景下，频繁的 Session 查找和存取可能影响性能。
4. **会话管理复杂**
   - 需要手动处理用户的会话过期时间，维护 Session 的有效性。
   - 如果没有合理的过期机制，Session 数据可能会占用大量内存，造成资源浪费。
5. **前端依赖 Cookie**
   - 传统的 Session 鉴权依赖于浏览器的 Cookie 机制。如果用户禁用了 Cookie 或使用了特殊的浏览器配置（如隐私模式），则会话管理会失败。

------

#### 适用场景

- 小型应用：对于小型的单服务器应用，传统的 Session 认证方式较为简单且有效。
- 不需要高度分布式的应用：如果应用没有分布式部署的需求，使用传统的 Session 鉴权能够快速实现。
- 用户量较小的应用：用户量较少时，Session 数据管理较为简单，适合传统的方式。

------

#### 代码实现举例

##### 后端

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;

@Controller
public class UserController {

    private final UserService authService;

    public UserController(UserService authService) {
        this.authService = authService;
    }

    // 登录
    @PostMapping("/login")
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        HttpSession session) {

        if (authService.isValidUser(username, password)) {
            session.setAttribute("username", username);  // 设置Session
            return 用户相关信息;
        } else {
            return "error"; 
        }
    }

    // 登出
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();  // 销毁session
    }
}

```

#### 在浏览器中查看

打开浏览器的开发者工具，在如下位置即可查看

![image-20250203114711197](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250203114711197.png)



### 二、JWT（JSON Web Token）认证方式

JWT 的优点是**灵活性高、无状态、易于扩展**，但也有一些**安全隐患**，例如，如果密钥管理不当，JWT 会容易受到攻击（如签名泄露）。

### JWT原理和数据结构

JWT是一种用于在网络应用环境中传递声明的开放标准（RFC 7519）。它通过一个 URL 安全的方式传递声明（如用户信息、权限等）。JWT 的主要作用是为了验证身份并安全地在客户端与服务器之间传递信息。

JWT 的基本原理是使用 **数字签名** 来验证发送方的身份和信息的完整性。JWT 主要由三部分组成：

1. **Header（头部）**
2. **Payload（负载）**
3. **Signature（签名）**

这三部分以点（`.`）连接，形成最终的 JWT 字符串：
 `<header>.<payload>.<signature>`

#### 1. **Header（头部）**

JWT 的头部通常由两部分组成：

- **alg**（算法）: 签名算法，如 `HS256`（HMAC SHA256）或者 `RS256`（RSA SHA256）等。
- **typ**（类型）: 该字段通常是 `JWT`，标识该对象是一个 JWT。

#### 示例（Header）：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

![image-20250203131817138](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250203131817138.png)

**编码过程：**
Header 会进行 Base64Url 编码，得到编码后的字符串部分。

#### 2. **Payload（负载）**

JWT 的负载部分存储了声明（Claims）。声明可以是关于实体（通常是用户）和其他数据的任何信息。负载并没有加密，所以可以直接读取。然而，为了保密性，敏感数据不应存放在 payload 中。

JWT 中的声明主要有三类：

- **注册声明（Registered Claims）**：这些是预定义的字段，但不是必须的。常用的有：
  - `sub`：主题（通常是用户 ID）
  - `iss`：发行者（Issuer）
  - `exp`：过期时间（Expiration Time）
  - `iat`：签发时间（Issued At）
  - `aud`：观众（Audience）
  - `nbf`：生效时间（Not Before）
- **公共声明（Public Claims）**：可以自定义，也可以使用已注册的名字。
- **私有声明（Private Claims）**：应用之间共享的自定义声明，通常为了传递额外的信息。

![image-20250203131921622](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250203131921622.png)

#### 示例（Payload）：

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

**编码过程：**
 类似于 Header，Payload 部分也需要进行 Base64Url 编码，得到编码后的字符串部分。

#### 3. **Signature（签名）**

签名是为了验证 JWT 的数据是否被篡改，并且确保消息的发送者是可信的。签名是根据以下几个部分计算得出的：

- 编码后的 Header
- 编码后的 Payload
- 一个密钥（对称算法）或者公私密钥对（非对称算法）

签名的生成过程：使用头部的 `alg` 指定的算法（例如 `HS256`）来签名。

![image-20250203132036246](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250203132036246.png)

#### 示例（Signature）：

假设使用 HMAC SHA256 算法（`HS256`），密钥为 `jieyu123456jieyu`，则签名计算过程如下：

```text
HMACSHA256(
  Base64UrlEncode(header) + "." + Base64UrlEncode(payload),
  secret)
```

**编码过程：**
 生成签名后，它会通过 Base64Url 编码，然后得到 JWT 的签名部分。





### 最终的 JWT 结构：

![image-20250203132115347](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250203132115347.png)

最终的 JWT 是由三部分组成，且通过点（`.`）连接：

- **Header**：`Base64Url(Header)`
- **Payload**：`Base64Url(Payload)`
- **Signature**：`Base64Url(Signature)`

### JWT 的工作流程

1. **用户登录**：当用户登录时，服务器验证用户的身份，并生成一个 JWT 令牌返回给客户端（通常是浏览器或移动应用）。服务器在生成 JWT 时，使用一个密钥（对称加密）或公私密钥对（非对称加密）进行签名。

2. **客户端存储 JWT**：客户端通常会将 JWT 存储在 `localStorage` 或 `sessionStorage` 中，或者通过 HTTP cookie 存储。

3. **请求授权**：在后续的 API 请求中，客户端将 JWT 作为 HTTP 请求头的一部分，使用 `Authorization` 字段发送到服务器：

   ```text
   Authorization: Bearer <JWT>
   ```

4. **服务器验证**：服务器通过验证签名来验证 JWT 的有效性。如果签名有效，并且其他声明（如 `exp`）也符合要求，服务器会处理请求。否则，拒绝请求并返回 401 未授权。

5. **过期机制**：JWT 通常会有一个过期时间 `exp`，一旦 JWT 过期，客户端需要重新获取一个新的 JWT。

> 为什么第三部分要加密：因为第三部分是防止用户篡改鉴定用的，所以不能对外显示





### 三、OAuth 认证

OAuth 是一种授权协议，它允许第三方应用在不暴露用户凭据（如用户名和密码）的情况下，访问用户在服务提供者上的资源。OAuth 是目前广泛使用的授权框架，尤其是在 Web 应用、移动应用和 API 认证中。OAuth 的核心思想是 **授权**，而非 **认证**。认证是验证用户的身份，而授权是允许用户的某些资源被第三方应用访问。OAuth 通过授权流程使得用户可以控制哪些应用可以访问哪些资源。

OAuth 2.0 是一种广泛使用的授权协议，适用于 Web 应用、移动应用、API 授权等场景。它通过访问令牌和授权流程实现了用户资源的安全授权，避免了直接暴露用户名和密码的风险。OAuth 2.0 提供了多种授权模式，适应不同的应用场景。同时，它通过角色和令牌机制，实现了精细化的资源授权和访问控制。在实施 OAuth 时，需关注安全性问题，确保令牌的安全存储、传输以及正确的权限控制。

> （官网和网址如下图）

![image-20250203171452630](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250203171452630.png)

------

#### **1. OAuth 协议**

- **OAuth 1.0 和 OAuth 2.0**：OAuth 2.0 是 OAuth 协议的升级版，它相比 OAuth 1.0 更加简洁、灵活，并且得到了广泛的使用。OAuth 2.0 不再使用复杂的加密算法，而是通过访问令牌来实现授权。
- **OAuth 2.0 流程**：OAuth 2.0 是以**授权码**为核心的授权流程，可以支持多种应用场景（Web、移动、桌面等）。

------

#### **2. OAuth 2.0 流程**

OAuth 2.0 流程通常分为以下几个步骤：

1. **用户请求授权**：
   - 用户尝试使用第三方应用访问某些资源时，第三方应用会重定向用户到授权服务器，用户在授权服务器上同意授权。
   - 授权请求中会包括：`client_id`（客户端标识）、`redirect_uri`（授权回调地址）、`response_type`（响应类型，通常为“code”）等参数。
2. **用户授权**：
   - 用户在授权服务器上进行身份验证，并授权第三方应用访问资源。
3. **授权码返回**：
   - 授权服务器在用户授权后，会将一个 **授权码**（Authorization Code）重定向回客户端应用指定的 `redirect_uri`。
4. **客户端请求令牌**：
   - 客户端应用使用授权码和自身的 **客户端密钥**（Client Secret）向授权服务器请求访问令牌（Access Token）。
   - 请求会通过 HTTPS 发送，通常包括：`client_id`、`client_secret`、`code`（授权码）、`redirect_uri` 等参数。
5. **获取访问令牌**：
   - 如果授权码有效，授权服务器会返回一个 **访问令牌**（Access Token）和一个 **刷新令牌**（Refresh Token）。
   - 访问令牌用于后续的资源访问，刷新令牌用于在访问令牌过期时重新获取新的访问令牌。
6. **资源访问**：
   - 客户端使用访问令牌访问受保护的资源服务器。访问令牌通常通过 `Authorization` 请求头以 `Bearer` 类型传递。

------

#### **3. OAuth 2.0 的四种授权模式**

OAuth 2.0 提供了四种授权流程模式，分别适用于不同的应用场景：

1. **授权码模式（Authorization Code Flow）**：

   - 最常用的 OAuth 2.0 授权模式。
   - 适用于 Web 应用和客户端应用，其中客户端应用的安全性较高，能妥善保管客户端密钥。
   - 通过浏览器重定向用户进行授权，并使用授权码交换访问令牌。

   **流程**：

   - 用户授权，获取授权码
   - 客户端用授权码请求访问令牌
   - 获取访问令牌后访问资源

2. **隐式授权模式（Implicit Flow）**：

   - 适用于 **单页应用（SPA）** 或 **移动应用**，这些应用没有后端服务器，无法安全存储客户端密钥。
   - 访问令牌直接返回给客户端（不使用授权码），因此令牌会直接暴露在客户端，安全性较低，通常用于非机密客户端。

   **流程**：

   - 用户授权，直接返回访问令牌
   - 客户端用令牌访问资源

3. **资源所有者密码模式（Resource Owner Password Flow）**：

   - 适用于 **可信应用**，即用户对客户端完全信任的情况（例如客户端是操作系统应用）。
   - 用户直接提供用户名和密码给客户端应用，客户端用这些凭据请求访问令牌。
   - 安全性较低，一般不推荐在没有必要的情况下使用。

   **流程**：

   - 用户提供用户名和密码
   - 客户端用凭据请求访问令牌
   - 获取访问令牌后访问资源

4. **客户端凭证模式（Client Credentials Flow）**：

   - 适用于 **服务器与服务器之间的通信**，例如后台服务之间的 API 调用。
   - 客户端应用使用其自身的凭证（如客户端 ID 和客户端密钥）向授权服务器请求访问令牌。

   **流程**：

   - 客户端凭证请求访问令牌
   - 获取访问令牌后访问资源

------

#### **4. OAuth 2.0 的主要角色**

OAuth 2.0 协议涉及到四个主要角色：

1. **资源所有者（Resource Owner）**：
   - 通常是应用的最终用户，拥有资源的控制权（例如用户的个人信息、照片、文件等）。
   - 用户授权应用访问其受保护的资源。
2. **客户端（Client）**：
   - 代表第三方应用的服务，可以是 Web 应用、移动应用、桌面应用等。
   - 客户端向授权服务器请求访问令牌，并使用令牌访问资源服务器。
3. **授权服务器（Authorization Server）**：
   - 负责授权客户端应用访问用户资源，并颁发访问令牌。
   - 它通常会验证客户端的身份，确保请求者有权限获取令牌。
4. **资源服务器（Resource Server）**：
   - 存储受保护的资源并提供访问接口。
   - 资源服务器验证客户端提供的访问令牌是否合法，如果合法，允许访问资源。

------

#### **5. OAuth 2.0 的访问令牌和刷新令牌**

- **访问令牌（Access Token）**：
  - 访问令牌用于授权客户端访问受保护的资源。
  - 令牌通常有有效期，一旦过期需要刷新或重新获取。
- **刷新令牌（Refresh Token）**：
  - 刷新令牌是用来获取新的访问令牌的凭证。
  - 它通常在访问令牌过期后使用，而不需要用户重新授权。
  - 刷新令牌一般具有较长的有效期，甚至可以一直有效。

------

#### **7. OAuth 的常见应用场景**

- 单点登录:OAuth 可以用于多个应用之间的授权和身份验证，解决跨多个系统的用户认证问题。
- 移动应用授权移动应用可以通过 OAuth 访问第三方服务的资源（如获取社交媒体数据、支付信息等）。
- API 授权:当需要第三方应用访问某个 API 时，OAuth 可以提供安全的授权机制，确保用户的隐私和安全。

### 

<Artalk />