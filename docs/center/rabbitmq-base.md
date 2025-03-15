# rabbitmq五种模式的总结

> 完整项目地址：https://github.com/9lucifer/rabbitmq4j-learning



## 一、简单模式

### （一）简单模式概述

RabbitMQ 的简单模式是最基础的消息队列模式，包含以下两个角色：
1. **生产者**：负责发送消息到队列。
2. **消费者**：负责从队列中接收并处理消息。

在简单模式中，消息的传递是单向的，生产者将消息发送到队列，消费者从队列中接收消息。

![image-20250216063036914](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216063036914.png)

---

### （二）生产者代码解析

#### 代码

生产者负责创建消息并将其发送到指定的队列中。

```java
package top.miqiu._01_hello;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Producer {
    public static void main(String[] args) throws IOException, TimeoutException {
        // 1. 创建连接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 2. 设置 RabbitMQ 服务器的 IP、端口、用户名和密码
        connectionFactory.setHost("ip（要换成真实的ip哦）");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");

        // 3. 创建连接对象
        Connection connection = connectionFactory.newConnection();
        // 4. 创建 Channel
        Channel channel = connection.createChannel();

        // 5. 声明队列
        /**
         * 参数说明：
         * 1. 队列名称：01-hello2
         * 2. 是否持久化：true（重启后队列仍然存在）
         * 3. 是否独占队列：false（允许多个消费者连接）
         * 4. 是否自动删除：false（队列不会自动删除）
         * 5. 额外参数：null
         */
        channel.queueDeclare("01-hello2", true, false, false, null);

        // 6. 发送消息
        /**
         * 参数说明：
         * 1. 交换机名称：空字符串（使用默认交换机）
         * 2. 路由键：队列名称（01-hello2）
         * 3. 额外属性：null
         * 4. 消息内容：字节数组
         */
        channel.basicPublish("", "01-hello2", null, "hello rabbitmq2".getBytes());
        System.out.println("消息发送成功");

        // 7. 关闭资源
        channel.close();
        connection.close();
    }
}
```
#### 结果

![image-20250216063335314](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216063335314.png)

---

### （三）消费者代码解析

#### 代码

消费者负责从队列中接收并处理消息。

```java
package top.miqiu._01_hello_c;

import com.rabbitmq.client.*;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Consumer {
    public static void main(String[] args) throws IOException, TimeoutException {
        // 1. 创建连接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 2. 设置 RabbitMQ 服务器的 IP、端口、用户名和密码
        connectionFactory.setHost("ip（要换成真实的ip哦");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");

        // 3. 创建连接对象
        Connection connection = connectionFactory.newConnection();
        // 4. 创建 Channel
        Channel channel = connection.createChannel();

        // 5. 声明队列（需与生产者保持一致）
        channel.queueDeclare("01-hello2", false, false, false, null);

        // 6. 接收消息
        /**
         * 参数说明：
         * 1. 队列名称：01-hello2
         * 2. 是否自动确认：true（消息被消费后自动确认）
         * 3. 消息处理回调：DeliverCallback
         * 4. 消息取消回调：CancelCallback
         */
        channel.basicConsume("01-hello2", true, new DeliverCallback() {
            @Override
            public void handle(String consumerTag, Delivery delivery) throws IOException {
                System.out.println("接收到消息：" + new String(delivery.getBody()));
            }
        }, new CancelCallback() {
            @Override
            public void handle(String consumerTag) throws IOException {
                System.out.println("消息被取消");
            }
        });
    }
}
```

#### 结果

![image-20250216063418597](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216063418597.png)

#### 在mq中查看

![image-20250216063443454](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216063443454.png)

---

### （四）总结

1. **简单模式**：适用于一对一的简单消息传递场景。
2. **生产者**：负责创建队列并发送消息。
3. **消费者**：负责从队列中接收并处理消息。
4. **注意事项**：
   - 队列名称需保持**一致**，不然一定会报错！
   - 消息确认机制需根据业务需求选择自动或手动确认。
   - 使用完资源后需显式关闭 `Channel` 和 `Connection`。





## 二、工作模式

### （一）工作模式概述
工作模式是 RabbitMQ 的一种常见模式，用于将任务分发给多个消费者。它的特点是：
1. **一个生产者**：负责发送消息到队列。
2. **多个消费者**：共同消费同一个队列中的消息。
3. **消息分发机制**：默认情况下，RabbitMQ 会以轮询（Round-Robin）的方式将消息分发给消费者。

工作模式适用于任务分发场景，例如将耗时的任务分发给多个 Worker 处理。

![image-20250216065036476](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216065036476.png)

---

### （二）生产者代码解析
生产者负责创建消息并将其发送到指定的队列中。

```java
package top.miqiu._02_work;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Producer {
    public static void main(String[] args) throws IOException, TimeoutException {
        // 1. 创建连接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 2. 设置 RabbitMQ 服务器的 IP、端口、用户名和密码
        connectionFactory.setHost("你的ip！别忘了改");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");

        // 3. 创建连接对象
        Connection connection = connectionFactory.newConnection();
        // 4. 创建 Channel
        Channel channel = connection.createChannel();

        // 5. 声明队列
        /**
         * 参数说明：
         * 1. 队列名称：02-work1
         * 2. 是否持久化：true（重启后队列仍然存在）
         * 3. 是否独占队列：false（允许多个消费者连接）
         * 4. 是否自动删除：false（队列不会自动删除）
         * 5. 额外参数：null
         */
        channel.queueDeclare("02-work1", true, false, false, null);

        // 6. 发送消息
        for (int i = 0; i < 20; i++) {
            String message = "hello work:" + i;
            channel.basicPublish("", "02-work1", null, message.getBytes());
        }
        System.out.println("消息发送成功");

        // 7. 关闭资源
        channel.close();
        connection.close();
    }
}
```

#### 关键点：
1. **队列声明（queueDeclare）**：创建队列并设置队列属性。
2. **消息发送（basicPublish）**：通过循环发送多条消息到队列。
3. **持久化队列**：设置为 `true`，确保队列在 RabbitMQ 重启后仍然存在。

---

### （三）消费者代码解析

#### 代码

消费者负责从队列中接收并处理消息。

```java
package top.miqiu._02_work;

import com.rabbitmq.client.*;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Consumer {
    public static void main(String[] args) throws IOException, TimeoutException {
        // 1. 创建连接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 2. 设置 RabbitMQ 服务器的 IP、端口、用户名和密码
        connectionFactory.setHost("你的ip！别忘了改");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");

        // 3. 创建连接对象
        Connection connection = connectionFactory.newConnection();
        // 4. 创建 Channel
        Channel channel = connection.createChannel();

        // 5. 声明队列（需与生产者保持一致）
        channel.queueDeclare("02-work1", true, false, false, null);

        // 6. 设置每次只接收一条消息
        channel.basicQos(1);

        // 7. 接收消息
        /**
         * 参数说明：
         * 1. 队列名称：02-work1
         * 2. 是否自动确认：false（手动确认消息）
         * 3. 消息处理回调：DeliverCallback
         * 4. 消息取消回调：CancelCallback
         */
        channel.basicConsume("02-work1", false, new DeliverCallback() {
            @Override
            public void handle(String consumerTag, Delivery delivery) throws IOException {
                try {
                    // 模拟消息处理耗时
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("消费者1 接收到消息：" + new String(delivery.getBody()));
                // 手动确认消息
                channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
            }
        }, new CancelCallback() {
            @Override
            public void handle(String consumerTag) throws IOException {
                System.out.println("消息被取消");
            }
        });
    }
}
```

#### 关键点：
1. **队列声明（queueDeclare）**：确保队列存在，需与生产者保持一致。
2. **消息预取（basicQos）**：设置每次只接收一条消息，避免某个消费者处理过多消息。
3. **手动确认（basicAck）**：消息处理完成后手动确认，确保消息不会丢失。
4. **消息处理耗时**：通过 `Thread.sleep(1000)` 模拟消息处理耗时。

#### 效果

![image-20250216065155794](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216065155794.png)

![image-20250216065214992](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216065214992.png)

---

### （四）工作模式的特点
1. **消息分发机制**：
   - 默认情况下，RabbitMQ 会以轮询的方式将消息分发给多个消费者。
   - 可以通过 `basicQos` 设置每次只接收一条消息，避免某个消费者处理过多消息。
2. **消息确认机制**：
   - 设置为手动确认（`autoAck=false`），确保消息处理完成后才确认。（防止业务处理失败的情况下丢失消息）
   - 如果消费者在处理消息时崩溃，未确认的消息会重新分发给其他消费者。
3. **适用场景**：
   - 任务分发场景，例如将耗时的任务分发给多个 Worker 处理。

---

### （五）总结
1. **工作模式**：适用于任务分发场景，多个消费者共同消费同一个队列中的消息。
2. **生产者**：负责发送消息到队列。
3. **消费者**：负责接收并处理消息，支持手动确认和消息预取。
4. **注意事项**：
   - 队列名称需保持一致。
   - 消息确认机制需根据业务需求选择自动或手动确认。
   - 使用 `basicQos` 控制消息分发，避免某个消费者处理过多消息。



## 三、发布订阅模式

### （一）发布订阅模式概述
发布订阅模式（Publish/Subscribe Mode）是 RabbitMQ 的一种模式，用于将消息广播给多个消费者。它的特点是：
1. **一个生产者**：将消息发送到交换机（Exchange）。
2. **多个消费者**：每个消费者都有自己的队列，并与交换机绑定。
3. **消息广播**：交换机将消息广播给所有绑定的队列。

发布订阅模式适用于消息广播场景，例如日志系统、通知系统等。

![image-20250216071658856](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216071658856.png)

---

### （二）生产者代码解析
生产者负责创建消息并将其发送到指定的交换机中。

```java
package top.miqiu._03_pubsub;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.MessageProperties;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Producer {
    public static void main(String[] args) throws IOException, TimeoutException {
        // 1. 创建连接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 2. 设置 RabbitMQ 服务器的 IP、端口、用户名和密码
        connectionFactory.setHost("用自己的ip！！");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");

        // 3. 创建连接对象
        Connection connection = connectionFactory.newConnection();
        // 4. 创建 Channel
        Channel channel = connection.createChannel();

        // 5. 声明交换机
        /**
         * 参数说明：
         * 1. 交换机名称：03-pubsub
         * 2. 交换机类型：fanout（广播模式）
         */
        channel.exchangeDeclare("03-pubsub", "fanout");

        // 6. 发送消息
        for (int i = 0; i < 20; i++) {
            String message = "hello work:" + i;
            /**
             * 参数说明：
             * 1. 交换机名称：03-pubsub
             * 2. 路由键：空字符串（fanout 模式忽略路由键）
             * 3. 消息属性：MessageProperties.TEXT_PLAIN
             * 4. 消息内容：字节数组
             */
            channel.basicPublish("03-pubsub", "", MessageProperties.TEXT_PLAIN, message.getBytes());
        }
        System.out.println("消息发送成功");

        // 7. 关闭资源
        channel.close();
        connection.close();
    }
}
```

#### 关键点：
1. **交换机声明（exchangeDeclare）**：创建交换机并设置类型为 `fanout`（广播模式）。
2. **消息发送（basicPublish）**：将消息发送到交换机，路由键为空字符串（`fanout` 模式忽略路由键）。
3. **消息广播**：消息会被广播到所有绑定到该交换机的队列。

---

### （三）消费者代码解析

#### 代码

消费者负责从队列中接收并处理消息。

```java
package top.miqiu._03_pubsub;

import com.rabbitmq.client.*;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Consumer2 {
    public static void main(String[] args) throws IOException, TimeoutException {
        // 1. 创建连接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 2. 设置 RabbitMQ 服务器的 IP、端口、用户名和密码
        connectionFactory.setHost("用自己的ip！！");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");

        // 3. 创建连接对象
        Connection connection = connectionFactory.newConnection();
        // 4. 创建 Channel
        Channel channel = connection.createChannel();

        // 5. 声明交换机
        channel.exchangeDeclare("03-pubsub", "fanout");

        // 6. 创建临时队列
        String queue = channel.queueDeclare().getQueue();

        // 7. 绑定队列到交换机
        /**
         * 参数说明：
         * 1. 队列名称：queue
         * 2. 交换机名称：03-pubsub
         * 3. 路由键：空字符串（fanout 模式忽略路由键）
         */
        channel.queueBind(queue, "03-pubsub", "");

        // 8. 接收消息
        /**
         * 参数说明：
         * 1. 队列名称：queue
         * 2. 是否自动确认：true（自动确认消息）
         * 3. 消息处理回调：DeliverCallback
         * 4. 消息取消回调：CancelCallback
         */
        channel.basicConsume(queue, true, new DeliverCallback() {
            @Override
            public void handle(String consumerTag, Delivery delivery) throws IOException {
                try {
                    // 模拟消息处理耗时
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("消费者2 接收到消息：" + new String(delivery.getBody()));
            }
        }, new CancelCallback() {
            @Override
            public void handle(String consumerTag) throws IOException {
                System.out.println("消息被取消");
            }
        });
    }
}
```

#### 关键点：
1. **交换机声明（exchangeDeclare）**：确保交换机存在，需与生产者保持一致。
2. **临时队列（queueDeclare）**：创建一个临时队列，队列名称由 RabbitMQ 自动生成。
3. **队列绑定（queueBind）**：将队列绑定到交换机，路由键为空字符串（`fanout` 模式忽略路由键）。
4. **消息接收（basicConsume）**：从队列中接收消息并处理。

#### 结果

![image-20250216071734904](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216071734904.png)

![image-20250216071749761](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216071749761.png)

> 可以看到两个consumer都消费了相同的消息

---

### （四）发布订阅模式的特点
1. **消息广播**：交换机将消息广播给所有绑定的队列。
2. **临时队列**：消费者可以创建临时队列，队列名称由 RabbitMQ 自动生成。
3. **适用场景**：
   - 日志系统：将日志消息广播给多个消费者。
   - 通知系统：将通知消息广播给多个用户。

---

### （五）总结
1. **发布订阅模式**：适用于消息广播场景，多个消费者各自接收相同的消息。
2. **生产者**：负责将消息发送到交换机。
3. **消费者**：负责创建队列并绑定到交换机，接收并处理消息。
4. **注意事项**：
   - 交换机类型需设置为 `fanout`。
   - 队列绑定到交换机时，路由键为空字符串。
   - 临时队列的名称由 RabbitMQ 自动生成。

---

### （六）RabbitMQ 交换机类型总结

| **交换机类型** | **描述**                                                   | **路由行为**                                               | **适用场景**                                   |
| -------------- | ---------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| **Fanout**     | 广播模式，将消息发送到所有绑定到该交换机的队列。           | 忽略路由键（Routing Key），消息会被广播到所有绑定的队列。  | 日志系统、通知系统等需要广播消息的场景。       |
| **Direct**     | 直接模式，根据路由键将消息发送到匹配的队列。               | 消息的路由键必须与队列绑定的路由键完全匹配。               | 任务分发、点对点通信等需要精确路由的场景。     |
| **Topic**      | 主题模式，根据路由键的模式匹配将消息发送到符合条件的队列。 | 支持通配符匹配：`*` 匹配一个单词，`#` 匹配零个或多个单词。 | 消息分类、多条件路由等需要灵活匹配的场景。     |
| **Headers**    | 头部模式，根据消息的头部属性（Headers）进行匹配。          | 不依赖路由键，而是通过消息的头部属性匹配队列绑定的条件。   | 复杂的路由逻辑，例如根据消息的元数据进行路由。 |

---

### 详细说明

#### 1. **Fanout 交换机**（广播，常用）
- **特点**：
  - 消息会被广播到所有绑定到该交换机的队列。
  - 忽略路由键（Routing Key）。
- **适用场景**：
  - 日志系统：将日志消息广播给多个消费者。
  - 通知系统：将通知消息广播给多个用户。

#### 2. **Direct 交换机**
- **特点**：
  - 消息的路由键必须与队列绑定的路由键完全匹配。
  - 支持一对一或一对多的精确路由。
- **适用场景**：
  - 任务分发：将特定任务路由到特定的 Worker。
  - 点对点通信：将消息发送到特定的接收者。

#### 3. **Topic 交换机**
- **特点**：
  - 支持通配符匹配：
    - `*` 匹配一个单词。
    - `#` 匹配零个或多个单词。
  - 路由键的格式通常是点分字符串（如 `user.create`）。
- **适用场景**：
  - 消息分类：根据消息的主题进行路由。
  - 多条件路由：支持灵活的路由规则。

#### 4. **Headers 交换机**
- **特点**：
  - 不依赖路由键，而是通过消息的头部属性（Headers）进行匹配。
  - 支持复杂的匹配规则（如 `x-match` 参数）。
- **适用场景**：
  - 复杂的路由逻辑：根据消息的元数据进行路由。
  - 需要高度灵活性的场景。

---

#### 对比

| **场景**     | **Fanout**                     | **Direct**                  | **Topic**                       | **Headers**                  |
| ------------ | ------------------------------ | --------------------------- | ------------------------------- | ---------------------------- |
| **日志广播** | 所有消费者接收相同的日志消息。 | 不适用。                    | 不适用。                        | 不适用。                     |
| **任务分发** | 不适用。                       | 将任务路由到特定的 Worker。 | 将任务分类路由到不同的 Worker。 | 根据任务的元数据进行路由。   |
| **通知系统** | 所有用户接收相同的通知。       | 特定用户接收特定通知。      | 根据通知类型路由到不同用户。    | 根据通知的元数据进行路由。   |
| **消息分类** | 不适用。                       | 不适用。                    | 根据消息主题进行路由。          | 根据消息的头部属性进行路由。 |

---

#### 总结
- **Fanout**：适用于广播场景。
- **Direct**：适用于精确路由场景。
- **Topic**：适用于灵活的路由场景。
- **Headers**：适用于复杂的路由逻辑。



## 四、路由模式

### （一）路由模式概述
路由模式是 RabbitMQ 的一种模式，使用 **Direct 交换机** 根据消息的 **路由键（Routing Key）** 将消息发送到匹配的队列。它的特点是：
1. **一个生产者**：将消息发送到 Direct 交换机，并指定路由键。
2. **多个消费者**：每个消费者可以绑定一个或多个路由键，只有匹配的路由键的消息才会被接收。
3. **精确路由**：消息的路由键必须与队列绑定的路由键完全匹配。

路由模式适用于需要根据特定条件精确路由消息的场景，例如日志级别分类、任务分发等。

![image-20250216073521308](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216073521308.png)

---

### （二）生产者代码解析
生产者负责创建消息并将其发送到 Direct 交换机，同时指定路由键。

```java
package top.miqiu._04_routing;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.MessageProperties;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Producer {
    public static void main(String[] args) throws IOException, TimeoutException {
        // 1. 创建连接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 2. 设置 RabbitMQ 服务器的 IP、端口、用户名和密码
        connectionFactory.setHost("你的ip！！！");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");

        // 3. 创建连接对象
        Connection connection = connectionFactory.newConnection();
        // 4. 创建 Channel
        Channel channel = connection.createChannel();

        // 5. 声明 Direct 交换机
        /**
         * 参数说明：
         * 1. 交换机名称：04-routing
         * 2. 交换机类型：direct
         */
        channel.exchangeDeclare("04-routing", "direct");

        // 6. 发送消息
        for (int i = 0; i < 20; i++) {
            String message = "hello work:" + i;
            /**
             * 参数说明：
             * 1. 交换机名称：04-routing
             * 2. 路由键：err（消息将发送到绑定 err 路由键的队列）
             * 3. 消息属性：MessageProperties.TEXT_PLAIN
             * 4. 消息内容：字节数组
             */
            channel.basicPublish("04-routing", "err", MessageProperties.TEXT_PLAIN, message.getBytes());
        }
        System.out.println("消息发送成功");

        // 7. 关闭资源
        channel.close();
        connection.close();
    }
}
```

#### 关键点：
1. **交换机声明（exchangeDeclare）**：创建 Direct 交换机，类型为 `direct`。
2. **消息发送（basicPublish）**：指定路由键（如 `err`），消息会被发送到绑定该路由键的队列。
3. **路由键匹配**：只有队列绑定的路由键与消息的路由键完全匹配时，消息才会被路由到该队列。

---

### （三）消费者代码解析

#### 代码

消费者负责创建队列并绑定到 Direct 交换机，同时指定路由键。

```java
package top.miqiu._04_routing;

import com.rabbitmq.client.*;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Consumer {
    public static void main(String[] args) throws IOException, TimeoutException {
        // 1. 创建连接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 2. 设置 RabbitMQ 服务器的 IP、端口、用户名和密码
        connectionFactory.setHost("你的ip！！！");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");

        // 3. 创建连接对象
        Connection connection = connectionFactory.newConnection();
        // 4. 创建 Channel
        Channel channel = connection.createChannel();

        // 5. 声明 Direct 交换机
        channel.exchangeDeclare("04-routing", "direct");

        // 6. 创建临时队列
        String queue = channel.queueDeclare().getQueue();

        // 7. 绑定队列到交换机，并指定路由键
        /**
         * 参数说明：
         * 1. 队列名称：queue
         * 2. 交换机名称：04-routing
         * 3. 路由键：info、err、waring
         */
        channel.queueBind(queue, "04-routing", "info");
        channel.queueBind(queue, "04-routing", "err");
        channel.queueBind(queue, "04-routing", "waring");

        // 8. 接收消息
        /**
         * 参数说明：
         * 1. 队列名称：queue
         * 2. 是否自动确认：true（自动确认消息）
         * 3. 消息处理回调：DeliverCallback
         * 4. 消息取消回调：CancelCallback
         */
        channel.basicConsume(queue, true, new DeliverCallback() {
            @Override
            public void handle(String consumerTag, Delivery delivery) throws IOException {
                try {
                    // 模拟消息处理耗时
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("消费者1 接收到消息：" + new String(delivery.getBody()));
            }
        }, new CancelCallback() {
            @Override
            public void handle(String consumerTag) throws IOException {
                System.out.println("消息被取消");
            }
        });
    }
}
```

#### 关键点：
1. **交换机声明（exchangeDeclare）**：确保 Direct 交换机存在，需与生产者保持一致。
2. **临时队列（queueDeclare）**：创建一个临时队列，队列名称由 RabbitMQ 自动生成。
3. **队列绑定（queueBind）**：将队列绑定到交换机，并指定路由键（如 `info`、`err`、`waring`）。
4. **消息接收（basicConsume）**：从队列中接收消息并处理。

#### 效果

consumer1绑定了[info，err，waring]，所以在producer绑定了info时发送消息的情况下，consumer1可以接收到信息

![image-20250216073403669](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216073403669.png)

由于consumer2绑定的是trace，所以consumer2是接收不到消息的

![image-20250216073447112](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216073447112.png)

---

### （四）路由模式的特点
1. **精确路由**：消息的路由键必须与队列绑定的路由键完全匹配。
2. **多路由键支持**：一个队列可以绑定多个路由键，接收多种类型的消息。
3. **适用场景**：
   - 日志级别分类：将不同级别的日志（如 `info`、`err`）路由到不同的队列。
   - 任务分发：将特定任务路由到特定的 Worker。

---

### （五）总结
1. **路由模式**：适用于需要根据路由键精确路由消息的场景。
2. **生产者**：负责将消息发送到 Direct 交换机，并指定路由键。
3. **消费者**：负责创建队列并绑定到 Direct 交换机，同时指定路由键。
4. **注意事项**：
   - 路由键必须完全匹配。
   - 一个队列可以绑定多个路由键，接收多种类型的消息。





## 五、Topic 模式

### （一）Topic 模式概述
Topic 模式是 RabbitMQ 的一种模式，使用 **Topic 交换机** 根据消息的 **路由键（Routing Key）** 进行模式匹配，将消息发送到符合条件的队列。它的特点是：
1. **一个生产者**：将消息发送到 Topic 交换机，并指定路由键。
2. **多个消费者**：每个消费者可以绑定一个或多个路由键模式，只有匹配的路由键的消息才会被接收。
3. **灵活的路由**：支持通配符匹配：
   - `*` 匹配一个单词。
   - `#` 匹配零个或多个单词。

Topic 模式适用于需要根据复杂条件灵活路由消息的场景，例如消息分类、多条件路由等。

![image-20250216075115591](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216075115591.png)

---

### （二）生产者代码解析

#### 代码

生产者负责创建消息并将其发送到 Topic 交换机，同时指定路由键。

```java
package top.miqiu._05_topic;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.MessageProperties;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Producer {
    public static void main(String[] args) throws IOException, TimeoutException {
        // 1. 创建连接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 2. 设置 RabbitMQ 服务器的 IP、端口、用户名和密码
        connectionFactory.setHost("用自己的ip！！");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");

        // 3. 创建连接对象
        Connection connection = connectionFactory.newConnection();
        // 4. 创建 Channel
        Channel channel = connection.createChannel();

        // 5. 声明 Topic 交换机
        /**
         * 参数说明：
         * 1. 交换机名称：05-topic
         * 2. 交换机类型：topic
         */
        channel.exchangeDeclare("05-topic", "topic");

        // 6. 发送消息
        for (int i = 0; i < 20; i++) {
            String message = "hello work:" + i;
            /**
             * 参数说明：
             * 1. 交换机名称：05-topic
             * 2. 路由键：user.hi（消息将发送到匹配 user.* 或 user.# 的队列）
             * 3. 消息属性：MessageProperties.TEXT_PLAIN
             * 4. 消息内容：字节数组
             */
            channel.basicPublish("05-topic", "user.hi", MessageProperties.TEXT_PLAIN, message.getBytes());
        }
        System.out.println("消息发送成功");

        // 7. 关闭资源
        channel.close();
        connection.close();
    }
}
```

#### 关键点：
1. **交换机声明（exchangeDeclare）**：创建 Topic 交换机，类型为 `topic`。
2. **消息发送（basicPublish）**：指定路由键（如 `user.hi`），消息会被发送到匹配的队列。
3. **通配符匹配**：
   - `*` 匹配一个单词（如 `user.*` 匹配 `user.hi`，但不匹配 `user.hi.there`）。
   - `#` 匹配零个或多个单词（如 `user.#` 匹配 `user.hi` 和 `user.hi.there`）。

---

### （三）消费者代码解析

#### 代码

消费者负责创建队列并绑定到 Topic 交换机，同时指定路由键模式。

```java
package top.miqiu._05_topic;

import com.rabbitmq.client.*;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Consumer2 {
    public static void main(String[] args) throws IOException, TimeoutException {
        // 1. 创建连接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 2. 设置 RabbitMQ 服务器的 IP、端口、用户名和密码
        connectionFactory.setHost("用自己的ip！！");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");

        // 3. 创建连接对象
        Connection connection = connectionFactory.newConnection();
        // 4. 创建 Channel
        Channel channel = connection.createChannel();

        // 5. 声明 Topic 交换机
        channel.exchangeDeclare("05-topic", "topic");

        // 6. 创建临时队列
        String queue = channel.queueDeclare().getQueue();

        // 7. 绑定队列到交换机，并指定路由键模式
        /**
         * 参数说明：
         * 1. 队列名称：queue
         * 2. 交换机名称：05-topic
         * 3. 路由键模式：user.*（匹配 user.hi、user.hello 等）
         */
        channel.queueBind(queue, "05-topic", "user.*");

        // 8. 接收消息
        /**
         * 参数说明：
         * 1. 队列名称：queue
         * 2. 是否自动确认：true（自动确认消息）
         * 3. 消息处理回调：DeliverCallback
         * 4. 消息取消回调：CancelCallback
         */
        channel.basicConsume(queue, true, new DeliverCallback() {
            @Override
            public void handle(String consumerTag, Delivery delivery) throws IOException {
                try {
                    // 模拟消息处理耗时
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("消费者2 user.* 接收到消息：" + new String(delivery.getBody()));
            }
        }, new CancelCallback() {
            @Override
            public void handle(String consumerTag) throws IOException {
                System.out.println("消息被取消");
            }
        });
    }
}
```

#### 关键点：
1. **交换机声明（exchangeDeclare）**：确保 Topic 交换机存在，需与生产者保持一致。
2. **临时队列（queueDeclare）**：创建一个临时队列，队列名称由 RabbitMQ 自动生成。
3. **队列绑定（queueBind）**：将队列绑定到交换机，并指定路由键模式（如 `user.*`）。
4. **消息接收（basicConsume）**：从队列中接收消息并处理。

#### 效果

当我在producer使用“employee.hi”作为路由key的时候，绑定了“employee.*”的consumer1可以消费这个消息

![image-20250216075306371](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250216075306371.png)

---

### （四）Topic 模式的特点
1. **灵活的路由**：支持通配符匹配，可以根据复杂的条件路由消息。
2. **多路由键支持**：一个队列可以绑定多个路由键模式，接收多种类型的消息。
3. **适用场景**：
   - 消息分类：根据消息的主题进行路由。
   - 多条件路由：支持灵活的路由规则。

---

### （五）总结
1. **Topic 模式**：适用于需要根据复杂条件灵活路由消息的场景。
2. **生产者**：负责将消息发送到 Topic 交换机，并指定路由键。
3. **消费者**：负责创建队列并绑定到 Topic 交换机，同时指定路由键模式。
4. **注意事项**：
   - 路由键模式支持通配符 `*` 和 `#`。
   - 一个队列可以绑定多个路由键模式，接收多种类型的消息。



<Artalk />