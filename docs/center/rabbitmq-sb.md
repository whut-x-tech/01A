# rabbitmq五种模式的实现——springboot

> 基础知识和javase的实现形式可以看我之前的博客
>
> 代码地址：https://github.com/9lucifer/rabbitmq4j-learning

## 一、进行集成

### （一）Spring Boot 集成 RabbitMQ 概述
Spring Boot 提供了对 RabbitMQ 的自动配置支持，通过 `RabbitTemplate` 和 `@RabbitListener` 可以方便地实现消息的生产和消费。以下是基于 Spring Boot 的 RabbitMQ 集成示例。

---

### （二）生产者代码解析
生产者负责创建消息并将其发送到指定的队列中。

#### 1. 配置文件（application.yml）
```yaml
spring:
  rabbitmq:
    host: 自己服务器的ip       # RabbitMQ 服务器地址
    port: 5672               # RabbitMQ 端口号
    username: admin          # RabbitMQ 用户名
    password: admin          # RabbitMQ 密码
    virtual-host: /          # 虚拟主机（默认是 /）
server:
  port: 8081                 # 应用端口
```

#### 2. 生产者代码（Controller）
```java
package top.miqiu.controller;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SendController {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @GetMapping("/sendMsg")
    public String sendMsg(@RequestParam String msg) {
        // 发送消息到队列 boot_queue
        rabbitTemplate.convertAndSend("", "boot_queue", msg);
        return "发送成功: " + msg;
    }
}
```

#### 关键
1. **RabbitTemplate**：Spring 提供的 RabbitMQ 操作模板，用于发送消息。
2. **convertAndSend**：发送消息到指定队列。
3. **@GetMapping**：定义一个 GET 请求接口，路径为 `/sendMsg`。

#### 效果

![image-20250216093813082](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216093813082.png)

---

### （三）消费者代码解析
消费者负责从队列中接收并处理消息。

#### 消费者代码（Listener）
```java
package top.miqiu.controller;

import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class Receive {

    @RabbitListener(queuesToDeclare = @Queue("boot_queue"))
    public void consumer(String msg) {
        System.out.println("消息内容为：" + msg);
    }
}
```

#### 关键
1. **@RabbitListener**：监听指定队列，当队列中有消息时，自动调用 `consumer` 方法。
2. **queuesToDeclare**：如果队列不存在，会自动创建队列。

#### 效果

![image-20250216093839842](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216093839842.png)





## 二、工作模式

### （一）生产者

1. 生产者通过 `RabbitTemplate` 将消息发送到 RabbitMQ 的队列中。

2. **关键代码解析**

   java复制

   ```java
   rabbitTemplate.convertAndSend("", "boot_work", msg + i);
   ```

   - **`rabbitTemplate`**：RabbitMQ 的核心操作类，用于发送消息。
   - **`convertAndSend` 方法**：
     - 第一个参数是交换机名称（这里为空字符串，表示默认交换机）。
     - 第二个参数是队列名称（`boot_work`）。
     - 第三个参数是消息内容（`msg + i`）。
   - **循环发送**：代码中通过循环发送了 20 条消息，每条消息内容为 `msg + i`。

3. **运行逻辑**
   生产者调用 `/sendMsg` 接口时，会将消息发送到队列 `boot_work` 中，消息内容为循环生成的字符串。

------

### （二）消费者

1. **功能描述**
   消费者从队列中接收消息并处理，处理完成后发送确认信号。

2. **关键代码解析**

   ```java
   @RabbitListener(queuesToDeclare = @Queue("boot_work"))
   ```

   - **`@RabbitListener`**：注解用于监听指定队列的消息。
   - **`queuesToDeclare`**：声明队列名称（`boot_work`）。
   - **`@Queue`**：声明队列的详细信息。

   ```java
   public void consumer(
           String msg,
           @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag,
           Channel channel
   ) throws IOException, InterruptedException {
       Thread.sleep(1000); // 模拟消息处理时间
       channel.basicAck(deliveryTag, true); // 确认消息已处理
       System.out.println("消费者1 消息内容为：" + msg);
   }
   ```
   
   - **`msg`**：接收到的消息内容。
   - **`deliveryTag`**：消息的唯一标识，用于确认消息是否成功处理。
   - **`Channel`**：RabbitMQ 的通道，用于执行消息确认操作。
   - **`basicAck`**：确认消息已处理，避免消息重复发送。
     - 第一个参数是 `deliveryTag`。
     - 第二个参数是 `multiple`，表示是否批量确认。
   
3. **运行逻辑**
   消费者监听队列 `boot_work`，接收到消息后模拟处理时间（`Thread.sleep(1000)`），然后通过 `channel.basicAck` 发送确认信号，表示消息已处理完成。

### （三）效果

![image-20250216102608684](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216102608684.png)

可以看到休眠的时长不同，消费的速度不同，侧面证明该模式适用于任务分配场景，多个消费者可以并行处理任务，提高效率。



## 三、Pub/Sub 模式

### （一）Pub/Sub 模式概述

Pub/Sub（发布/订阅）模式是一种消息传递模式，生产者将消息发送到一个交换机（Exchange），而不是直接发送到队列。消费者通过绑定交换机来接收消息。这种模式允许多个消费者订阅同一个消息源，实现消息的广播。

### （二）生产者

1. **功能描述**
   生产者通过 `RabbitTemplate` 将消息发送到一个名为 `boot-pubsub` 的交换机。

2. **关键代码解析**

   ```java
   rabbitTemplate.convertAndSend("boot-pubsub", "", msg);
   ```

   - **`convertAndSend` 方法**：
     - 第一个参数是交换机名称（`boot-pubsub`）。
     - 第二个参数是路由键（这里为空字符串，表示不指定路由键）。
     - 第三个参数是消息内容（`msg`）。
   - **交换机类型**：`boot-pubsub` 是一个 `fanout` 类型的交换机，它会将消息广播到所有绑定的队列。

3. **运行逻辑**
   生产者调用 `/sendPubsub` 接口时，将消息发送到 `boot-pubsub` 交换机，交换机会将消息广播到所有绑定的队列。

4. **运行结果**

   ![image-20250216104227902](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216104227902.png)

------

### （三）消费者

1. **功能描述**
   消费者通过绑定到 `boot-pubsub` 交换机接收消息，并处理接收到的消息。

2. **关键代码解析**

   ```java
   @RabbitListener(bindings =
           @QueueBinding(
                   value = @Queue,
                   exchange = @Exchange(value = "boot-pubsub", type = "fanout")
           ))
   public void consumer(String msg) {
       System.out.println("consumer 4 消息内容为：" + msg);
   }
   ```

   - **`@RabbitListener`**：注解用于监听消息。
   - **`@QueueBinding`**：声明队列与交换机的绑定关系。
     - **`value = @Queue`**：声明一个匿名队列。
     - **`exchange = @Exchange`**：声明交换机的名称（`boot-pubsub`）和类型（`fanout`）。
   - **`consumer` 方法**：处理接收到的消息，并打印消息内容。

3. **运行逻辑**
   消费者绑定到 `boot-pubsub` 交换机，接收所有广播的消息，并打印消息内容。

4. **运行效果**

   ![image-20250216104255415](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216104255415.png)

------

### （四）Pub/Sub 模式特点

1. **广播机制**
   生产者发送的消息会被广播到所有绑定到交换机的队列，多个消费者可以同时接收相同的消息。
2. **解耦合**
   生产者和消费者之间通过交换机解耦，生产者无需知道消费者的存在，消费者也无需知道生产者的存在。
3. **动态绑定**
   可以动态添加或移除消费者，而无需修改生产者的代码。

### 

---

## 四、Routing 模式

### （一）Routing 模式概述

Routing 模式是一种基于路由键（Routing Key）的消息路由模式。生产者将消息发送到 `direct` 类型的交换机，并指定一个路由键。消费者通过绑定到交换机并指定绑定键（Binding Key）来接收消息。只有路由键与绑定键完全匹配时，消息才会被路由到对应的队列。

---

### （二）生产者

1. **功能描述**
   生产者通过 `RabbitTemplate` 将消息发送到 `boot-routing` 交换机，并指定路由键（`key`）。

2. **关键代码解析**

   ```java
   rabbitTemplate.convertAndSend("boot-routing", key, msg);
   ```

   - **`boot-routing`**：交换机名称，类型为 `direct`。
   - **`key`**：路由键，由方法参数传入，用于指定消息的路由规则。
   - **`msg`**：消息内容，由方法参数传入。

3. **运行逻辑**
   生产者调用 `/sendRouting` 接口时，将消息发送到 `boot-routing` 交换机，并通过路由键决定消息的去向。

![image-20250216113239428](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216113239428.png)

---

### （三）消费者

1. **功能描述**
   消费者通过绑定到 `boot-routing` 交换机接收消息，并处理接收到的消息。

2. **关键代码解析**

   ```java
   @RabbitListener(bindings =
           @QueueBinding(
                   value = @Queue,
                   exchange = @Exchange(value = "boot-routing", type = "direct"),
                   key = {"trace"}
           ))
   public void consumer(String msg) {
       System.out.println("consumer 6 消息内容为：" + msg);
   }
   ```

   - **`@RabbitListener`**：注解用于监听消息。
   - **`@QueueBinding`**：声明队列与交换机的绑定关系。
     - **`value = @Queue`**：声明一个匿名队列。
     - **`exchange = @Exchange`**：声明交换机的名称（`boot-routing`）和类型（`direct`）。
     - **`key = {"trace"}`**：绑定键，表示该队列只接收路由键为 `trace` 的消息。
   - **`consumer` 方法**：处理接收到的消息，并打印消息内容。

3. **运行逻辑**
   消费者绑定到 `boot-routing` 交换机，并通过绑定键 `trace` 接收匹配的消息。

![image-20250216113302874](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216113302874.png)

---

### （四）Routing 模式特点

1. **精确匹配**
   `direct` 类型的交换机要求路由键与绑定键完全匹配，消息才会被路由到对应的队列。

2. **多队列绑定**
   一个交换机可以绑定多个队列，每个队列可以指定不同的绑定键。

3. **解耦合**
   生产者和消费者之间通过交换机解耦，生产者无需知道消费者的存在，消费者也无需知道生产者的存在。



## 五、Topic 模式

### （一）Topic 模式概述

Topic 模式是一种灵活的发布/订阅消息模式，适用于需要根据动态路由规则分发消息的场景。生产者将消息发送到一个 `topic` 类型的交换机，并指定一个路由键（Routing Key）。消费者通过绑定交换机并指定匹配规则（Binding Key）来接收消息。`topic` 类型的交换机支持模糊匹配，允许更灵活的消息路由。

### （二）生产者

1. **功能描述**
   生产者通过 `RabbitTemplate` 将消息发送到 `boot-topic` 交换机，并指定路由键（`key`）。

2. **关键代码解析**

   ```java
   rabbitTemplate.convertAndSend("boot-topic", key, msg);
   ```

   - **`boot-topic`**：交换机名称，类型为 `topic`。
   - **`key`**：路由键，由方法参数传入，用于指定消息的路由规则。例如，`user.login` 或 `user.register`。
   - **`msg`**：消息内容，由方法参数传入。

3. **运行逻辑**
   生产者调用 `/sendTopic` 接口时，将消息发送到 `boot-topic` 交换机，并通过路由键决定消息的去向。交换机会根据绑定规则将消息路由到匹配的队列。

![image-20250216123803069](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216123803069.png)

------

### （三）消费者

1. **功能描述**
   消费者通过绑定到 `boot-topic` 交换机接收消息，并处理接收到的消息。

2. **关键代码解析**

   ```java
   @RabbitListener(bindings =
           @QueueBinding(
                   value = @Queue,
                   exchange = @Exchange(value = "boot-topic", type = "topic"),
                   key = {"user.*"}
           ))
   public void consumer(String msg) {
       System.out.println("consumer 8 user.* 消息内容为：" + msg);
   }
   ```

   - **`@RabbitListener`**：注解用于监听消息。
   - **`@QueueBinding`**：声明队列与交换机的绑定关系。
     - **`value = @Queue`**：声明一个匿名队列。
     - **`exchange = @Exchange`**：声明交换机的名称（`boot-topic`）和类型（`topic`）。
     - **`key = {"user.\*"}`**：绑定键，表示该队列只接收路由键以 `user.` 开头的消息（例如 `user.login` 或 `user.register`）。
   - **`consumer` 方法**：处理接收到的消息，并打印消息内容。

3. **运行逻辑**
   消费者绑定到 `boot-topic` 交换机，并通过绑定键 `user.*` 接收匹配的消息。例如，生产者发送路由键为 `user.login` 的消息时，该消费者会接收并处理该消息。

   ![image-20250216123818814](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216123818814.png)

------

### （四）Topic 模式特点

1. **灵活的路由规则**
   - `topic` 类型的交换机支持模糊匹配：
     - `*`（星号）：匹配一个单词。
     - `#`（井号）：匹配零个或多个单词。
   - 例如，路由键为 `user.login` 的消息可以被绑定键为 `user.*` 或 `user.login` 的队列接收。
2. **动态绑定**
   消费者可以根据需要动态绑定不同的队列，而无需修改生产者的代码。
3. **解耦合**
   生产者和消费者之间通过交换机解耦，生产者无需知道消费者的存在，消费者也无需知道生产者的存在。

------

### （五）注意事项

1. **交换机类型**
   确保交换机类型为 `topic`，因为 `topic` 类型的交换机支持模糊匹配。
2. **绑定键的正确性**
   消费者需要正确设置绑定键（`key`），否则无法接收到匹配的消息。
3. **路由键的格式**
   路由键应使用点分隔符（`.`），例如 `user.login` 或 `trace.error`，以符合 `topic` 交换机的匹配规则。
4. **队列声明**
   如果使用匿名队列（`@Queue`），队列会在消费者启动时自动创建，但在 RabbitMQ 管理界面中可能看不到队列名称。如果需要持久化队列，可以显式声明队列名称。
5. **消息丢失问题**
   如果没有消费者绑定到匹配的路由键，消息可能会丢失。可以通过设置交换机的 DLX（Dead Letter Exchange）来处理未消费的消息。

<Artalk />