### 大厂见闻录——后端单测

你是一个幸运儿，你过五关斩六将，拿到了大厂实习offer。

你对**性能优化**了如指掌，你对**锁**和**高并发**倒背如流。你怀揣着满满的业务理解，希望在未来的几个月大展宏图。

你的mentor经验丰富，组内的业务朝气蓬勃。

你接到了第一个需求（怀揣着激动），你以为是设计xxx模块，优化xxx接口，定睛一看——为xxx功能编写**单测**！

……

开个玩笑，其实单测没那么可怕，它早已成为每个实习生入职的“必修课”。在大厂项目中，单元测试往往是新手最早接触、也最容易上手的一部分工作。原因主要有下面几点：一方面，大厂的项目庞大复杂，服务动辄数十个模块联动，启动一次应用可能就需要几分钟，甚至还要拉起一整套依赖服务。如果每改一行代码都靠本地全量启动来验证功能，不仅效率低下，还极容易被各种依赖卡住；另一方面，一个功能在真实环境中往往依赖多个组件，比如远程服务调用、消息中间件、定时任务调度、数据库读写等，很多逻辑在本地调试阶段难以构造出完整链路。这时候，单元测试就像是一把“放大镜”+“模拟器”，让开发者可以聚焦在某一个方法、某一个功能点上，通过精心构造输入、模拟依赖、验证输出，快速高效地完成逻辑验证。还有一点，这一点和我们相关性较强——借助单元测试可以帮我们更好的熟悉相关链路，因为实际在编写单元测试的时候你就会发现，不熟悉代码逻辑，单测就只能依靠伟大的ai大人了——你还得为对错战战兢兢。

#### 单测介绍

<img src="http://imgtu.oss-cn-beijing.aliyuncs.com/png/2025_07_02/84bb27013c1d4c16b7ae0fe3af3575a9.png" alt="image-20250519144428850" style="zoom:50%;" />

单测，全称单元测试，就是对代码中的最小功能单元——通常是类或方法——进行测试，确保它们在各种输入条件下都能得到正确的输出。与集成测试不同，单测给我最大的感觉是隔离环境和快速见效。通过使用模拟对象（如 Mockito ）、断言库、Junit等框架，开发者可以非常精细地验证一个方法在特定边界条件、异常路径、依赖出错等场景下的行为。举个例子：一个订单处理函数可能依赖库存服务和用户服务，如果每次测试都要先确保库存服务可用、用户服务响应正常，测试效率将大打折扣；但用单测，你可以通过 mock 技术让库存服务“假装返回库存充足”，让用户服务“假装认证成功”，你要测的只剩核心业务逻辑本身。

#### 指导原则

自动、独立、可重复执行

边界值测试、正确的输入、与设计文档结合、强制错误信息输入（输入非法数据，得到预期的结果）

#### 哪些需要编写单测

- 底层模块，出了问题难以察觉，影响很广
- 自动化和手工测试成本高，难以模拟边界条件
- 重逻辑和规则的计算，而非流程编排和模块组装

> 一切跨类跨系统的测试都不是单元测试

#### Mockito用法

Mockito 不能对以下内容进行模拟（mock）或间谍（spy）：

- **final 类**

- **final 方法**

- **枚举（Enums）**

- **静态方法**

- **私有方法**

- **hashCode() 和 equals() 方法**

- **匿名类**

- **原始数据类型（primitive types）**

  

##### Stub（插桩）

Stub过程定义了模拟方法的行为，例如应该返回什么值，或者在调用方法时是否应该抛出任何异常。
Mockito框架支持存根，并允许我们在调用特定方法时返回给定值。可以使用Mockito.when（）和thenReturn（）来完成。
以下是导入时的语法：

```java
Mockito.when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
```

when（）方法表示触发器——何时截断它。以下方法用于表示触发器动作或触发器被触发时要做什么:

> •thenReturn（要返回的值）：此方法返回给定值。
> •thenThrow（可抛出的throw）：此方法抛出给定的异常。
> •thenAnswer（答案）：在这种方法中，与返回硬编码值不同，执行动态的、用户定义的逻辑；更像是假测试双打。
> 答案是一个界面。实现Answer接口需要动态代码逻辑。
> •thenCallRealMethod（）：此方法调用模拟对象/spy上的real方法。

变体：

```java
when(userRepository.someMethod()).thenReturn(10,5,100);
        assertEquals(10, userRepository.someMethod());
        assertEquals(5, userRepository.someMethod());
        assertEquals(100, userRepository.someMethod());
```



在测试中，我们通过 `RequestBuilder` 类调用 `HttpServletRequest` 的 `getParameter()` 方法，以获取请求参数。在测试方法中，采用 `thenReturn` 风格对 `getParameter()` 调用进行了模拟终止。此处使用了两个 Mockito 匹配器：`anyString()` 和 `isA()`。其中，`anyString()` 匹配器用于为 `getParameter(String name)` 方法设置返回值。比如当调用 `webReq.getParameter("page")` 时，无论传入的字符串参数是什么，都会匹配成功并返回预设的硬编码值。由于 `anyString()` 是一个泛型参数匹配器，因此它适用于任何传入的字符串值，简化了测试的配置。而 `isA()` 匹配器则用于模拟 `CountryDao` 中某个检索方法的行为，它会匹配所有指定类型的参数。通过 `isA(SomeClass.class)`，我们可以在不关心具体参数值的情况下，确保只要传入的是指定类型的对象，就会触发相应的模拟返回逻辑。这种方式提高了测试的灵活性和可维护性，同时使我们可以专注于验证调用流程和结果，而不必过多关注参数的具体内容。

##### 异常的抛出

单元测试不仅适用于成功的测试，也应该测试我们的代码是否出现故障。Mockito提供了一个API来在测试过程中引发错误。假设我们正在测试一个流，系统将抛出异常。我们可以使用Mockito的异常API对此进行测试。为此，Mockito提供了一个**thenThrow（Throwable）**方法。这个方法告诉Mockito框架在调用存根方法时抛出一个throwable的（可能是异常或错误）。

```
when(userRepository.someMethod()).thenThrow(new RuntimeException());
```

>  对没有返回值的函数

```java
doThrow(new RuntimeException("Test Exception")).when(userRepository).voidMethod();
```



##### 参数匹配器

参数匹配器是 Mockito 提供的一组方法，用来灵活地匹配方法调用时的参数。使用参数匹配器时，你可以指定如何匹配方法的参数，例如，可以指定匹配任何类型的对象、特定类型的对象、或者某个值等。

```java
when(mockObject.getValue(1)).thenReturn(expectedValue);
```

`isA` 匹配器用于检查传递的对象是否是指定类类型的实例。而 `any(T)` 匹配器也具有相同的功能，它用于匹配任何类型的参数。



##### 通配符匹配器

> 常用通配符匹配器

- `any()`, `anyInt()`, `anyLong()`, `anyString()`, `anyList()`, `anyMap()` 等
- `eq(value)`：精确匹配
- `isA(Class<T>)`：类型匹配
- `argThat(Predicate)`：自定义条件

当被测代码内部 new 了对象并传给 mock 时，测试代码拿不到这个对象的引用。这时只能用通配符匹配器（如 any、argThat）来匹配参数。通配符匹配器让你的 mock/stub 更灵活，不依赖具体实例。



##### 比较匹配器

**equalTo, is, and not**

```java
public class AssertThatTest {
@Test
public void verify_Matcher() throws Exception {
		int age = 30;
		assertThat(age, equalTo(30));
		assertThat(age, is(30));
		assertThat(age, not(equalTo(33)));
		assertThat(age, is(not(33)));
	}
}
```

将age变量设置为30，然后像assertEquals一样调用equalTo，这是一个匹配器；equalTo取一个值。如果匹配器值与实际值不匹配，assertThat将抛出AssertionError。将年龄变量值设置为29，然后重新运行测试；将出现以下错误：
	java.lang.Assertion错误：
		预期：<30>
		但是：<29>
is匹配器接受一个值，其行为类似于equalTo。not matcher接受一个值或一个匹配器,这只是年龄不是33岁，比断言方法更具**可读性**。



##### 复合值匹配器

**either, both, anyOf, allOf, and not**

```java
@Test
public void verify_multiple_values() throws Exception {
    double marks = 100.00;
    assertThat(marks, either(is(100.00)).or(is(90.9)));
    assertThat(marks, both(not(99.99)).and(not(60.00)));
    assertThat(marks, anyOf(is(100.00),is(1.00),is(55.00),is(88.00),
    is(67.8)));
    assertThat(marks, not(anyOf(is(0.00),is(200.00))));
    assertThat(marks, not(allOf(is(1.00),is(100.00), is(30.00))));
}
```

主要是能写出**或者-或者** / **要……还要……**的关系



##### `verify` 方法和 `Times` 参数

在 Mockito 中，`verify` 方法用于验证某个方法是否在 mock 对象上被调用过。我们可以通过配置 `Times` 参数来指定方法调用的次数和特定条件，以下是相关的笔记和使用细节：

1. `Times` 参数说明

* **`Times(0)`**: 如果向 `Times` 构造函数传递 `0`，这表示被验证的方法在测试路径中不会被调用。通过传递 `0`，我们可以确保某个方法没有被调用。

  **例子**：

  ```java
  verify(mockObject, times(0)).sell();
  ```

  这表示验证 `sell()` 方法在测试中没有被调用。

* **负数 (`Times(-1)`)**: 如果传递一个负数给 `Times` 构造函数，Mockito 会抛出 `MockitoException` 错误，显示 `Negative value is not allowed here`。

  **例子**：

  ```java
  // 这将抛出异常
  verify(mockObject, times(-1)).buy();
  ```

2. `verify` 方法和不同次数的调用验证

Mockito 提供了多种方式来验证某个方法的调用次数：

* **`times(int wantedNumberOfInvocations)`**: 指定期望方法调用的次数。如果方法没有被调用指定次数，测试会失败。

  **例子**：

  ```java
  verify(mockObject, times(3)).buy(); // 验证 `buy()` 方法被调用了 3 次
  ```

* **`never()`**: 相当于 `times(0)`，表示方法没有被调用。

  **例子**：

  ```java
  verify(mockObject, never()).sell(); // 验证 `sell()` 方法没有被调用
  ```

* **`atLeastOnce()`**: 表示方法至少被调用一次。如果方法没有被调用一次，测试会失败。

  **例子**：

  ```java
  verify(mockObject, atLeastOnce()).buy(); // 验证 `buy()` 方法至少被调用一次
  ```

* **`atLeast(int minNumberOfInvocations)`**: 指定方法至少被调用指定次数。若方法调用次数少于该值，测试失败。

  **例子**：

  ```java
  verify(mockObject, atLeast(2)).buy(); // 验证 `buy()` 方法至少被调用 2 次
  ```

* **`atMost(int maxNumberOfInvocations)`**: 指定方法最多被调用指定次数。如果方法被调用超过该次数，测试失败。

  **例子**：

  ```java
  verify(mockObject, atMost(5)).buy(); // 验证 `buy()` 方法最多被调用 5 次
  ```

* **`only()`**: 用于验证 mock 对象上只调用了某个方法，若其他方法被调用，测试会失败。

  **例子**：

  ```java
  verify(mockObject, only()).buy(); // 验证 `buy()` 方法是唯一被调用的方法
  ```

* **`timeout(int millis)`**: 用于验证方法调用发生在指定的时间范围内，单位为毫秒。

  **例子**：

  ```java
  verify(mockObject, timeout(1000)).buy(); // 验证 `buy()` 方法在 1000 毫秒内被调用
  ```

**验证没有交互和没有更多交互**

* **`verifyZeroInteractions(object, mocks)`**: 用于验证没有发生过任何交互。如果没有方法被调用，测试通过。

  **例子**：

  ```java
  verifyZeroInteractions(mockObject1, mockObject2); // 验证 mockObject1 和 mockObject2 上没有任何方法被调用
  ```

* **`verifyNoMoreInteractions(object, mocks)`**: 用于验证在所有已经验证过的方法调用之后，mock 对象上没有发生过任何其他交互。如果有额外的交互没有被验证过，测试会失败。

  **例子**：

  ```java
  mockObject.getParameter("page");
  verify(mockObject).getParameter(anyString()); // 验证 `getParameter()` 被调用
  verifyNoMoreInteractions(mockObject); // 验证没有其他方法调用
  ```

  这将失败，如果在 `verify()` 后 `mockObject` 上调用了其他方法（例如 `getContextPath()`），即使该方法没有被 `verify` 验证过。

* **`verifyZeroInteractions`** 和 **`verifyNoMoreInteractions`** 的使用要谨慎。如果测试中有多个方法的交互，这两个方法可能导致测试失败，特别是当你不想验证所有交互时。

* 过多的 `verifyNoMoreInteractions` 或 `verifyZeroInteractions` 验证可能导致测试变得过于脆弱，容易出错。



###### 应答方法调用

> 简而言之就是如何返回动态的值

Mockito允许使用通用的Answer界面进行修改；这是一个回调。当调用模拟对象上的存根方法时，会调用answer方法。Answer对象的Answer（）方法返回实际对象。

`when(mock.someMethod()).thenAnswer(new Answer() {…});`



#### Mockito架构

Mockito应用代理设计模式来创建模拟对象。对于具体类，Mockito内部使用CGLib创建代理存根。CGLib用于生成动态代理对象和拦截字段访问。以下序列图描述了调用序列。ClassImpossibler类是一个单例类。此类有一个createProxyClass方法，用于使用CGLib生成源代码。最后，它使用反射来创建代理类的实例，方法调用使用MethodInterceptor的回调API进行存根。

![image-20250521171448661](http://imgtu.oss-cn-beijing.aliyuncs.com/png/2025_07_02/7e79917a4bd2451b917c9146d232142e.png)



