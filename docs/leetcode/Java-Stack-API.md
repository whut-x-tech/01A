## 🚩 Java Stack API 介绍（LeetCode 刷题常用）

------

## 一、Stack 常用实现方式：

有两种方式：

- 使用 Java 自带的 `Stack` 类（简单易用，但性能一般）
- 使用 `Deque` 双端队列接口实现栈功能（推荐，性能更佳）

### 推荐方式：

```java
Deque<Integer> stack = new ArrayDeque<>();
```

### 传统方式：

```java
Stack<Integer> stack = new Stack<>();
```

------

## 二、Stack 常用 API 方法：

| 方法          | 功能描述             | 空栈时行为                          |
| ------------- | -------------------- | ----------------------------------- |
| **push(E e)** | 压入栈顶             | -                                   |
| **pop()**     | 弹出并返回栈顶元素   | 空栈抛出异常（EmptyStackException） |
| **peek()**    | 返回栈顶元素但不弹出 | 空栈抛出异常（EmptyStackException） |
| **isEmpty()** | 判断栈是否为空       | 返回 true 或 false                  |
| **size()**    | 返回栈中元素数量     | 0                                   |
| **clear()**   | 清空栈               | -                                   |

------

## 🚩 常见示例（LeetCode 场景）：

### 示例 1：基础 Stack 使用

```java
Deque<Integer> stack = new ArrayDeque<>();

stack.push(1);
stack.push(2);
stack.push(3);

while (!stack.isEmpty()) {
    System.out.println(stack.pop());
}
```

输出（后进先出）：

```
3
2
1
```

------

### 示例 2：用 Stack 进行括号匹配 (LeetCode 20)

```java
public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');
        else if (c == '{') stack.push('}');
        else if (c == '[') stack.push(']');
        else if (stack.isEmpty() || stack.pop() != c) return false;
    }
    return stack.isEmpty();
}
```

------

### 示例 3：单调栈典型应用（LeetCode 739，每日温度）

```java
public int[] dailyTemperatures(int[] temperatures) {
    int[] res = new int[temperatures.length];
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < temperatures.length; i++) {
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prev = stack.pop();
            res[prev] = i - prev;
        }
        stack.push(i);
    }
    return res;
}
```

------

## 🚩 实践经验 & 推荐：

- 推荐使用 `Deque` 代替 Java 中的 `Stack` 类，原因：
  - `Stack` 类继承自 `Vector`，同步操作（synchronized），性能略低。
  - `Deque` (`ArrayDeque`) 性能更好，且提供了丰富灵活的操作方法。
- 常规使用场景中：
  - 入栈使用：`push()`
  - 出栈使用：`pop()`
  - 查看栈顶：`peek()`

------

## 🎯 快速记忆（推荐组合）：

| 操作         | 推荐方法组合 |
| ------------ | ------------ |
| 元素入栈     | `push(e)`    |
| 元素出栈     | `pop()`      |
| 查看栈顶元素 | `peek()`     |

<Artalk />