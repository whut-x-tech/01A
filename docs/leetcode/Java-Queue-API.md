## 🚩 Java Queue 接口 API 介绍（LeetCode 刷题常用）

------

### 一、常用实现类：

- `LinkedList`（最常用）
- `ArrayDeque`（性能稍优，推荐使用）
- `PriorityQueue`（优先级队列，自动排序，默认小顶堆）

```java
Queue<Integer> queue = new LinkedList<>();
Queue<Integer> queue = new ArrayDeque<>();
Queue<Integer> pq = new PriorityQueue<>();
```

------

### 二、常用方法：

| 方法名         | 说明                     | 抛异常情况        |
| -------------- | ------------------------ | ----------------- |
| **offer(E e)** | 添加元素到队尾（推荐用） | 无，失败返回false |
| **add(E e)**   | 添加元素到队尾（不常用） | 队列满时抛异常    |
| **poll()**     | 移除并返回队首元素       | 无元素时返回null  |
| **remove()**   | 移除并返回队首元素       | 无元素时抛异常    |
| **peek()**     | 返回队首元素，但不移除   | 无元素时返回null  |
| **element()**  | 返回队首元素，但不移除   | 无元素时抛异常    |
| **isEmpty()**  | 队列是否为空             | 无异常情况        |
| **size()**     | 返回队列元素个数         | 无异常情况        |
| **clear()**    | 清空队列                 | 无异常情况        |

------

## 🚩 使用举例（LeetCode 常用）：

### 示例1：基础队列（BFS 常见场景）

```java
Queue<Integer> queue = new LinkedList<>();

queue.offer(1);
queue.offer(2);
queue.offer(3);

while (!queue.isEmpty()) {
    int current = queue.poll(); // 获取并删除队首元素
    System.out.println(current);
}
```

输出：

```
1
2
3
```

------

### 示例2：优先队列（最小堆，自动排序）：

```java
Queue<Integer> pq = new PriorityQueue<>();

pq.offer(5);
pq.offer(1);
pq.offer(3);

while (!pq.isEmpty()) {
    System.out.println(pq.poll());
}
```

输出（从小到大自动排序）：

```
1
3
5
```

------

## 🚩 实践经验（LeetCode刷题技巧）：

- 推荐使用 `offer()` / `poll()` / `peek()` 这一组方法，它们在队列为空或满时不会抛异常，而是返回`null`或`false`，更安全。
- BFS 过程中，使用 `LinkedList` 或 `ArrayDeque` 性能都不错（推荐 `ArrayDeque` 更高效一些）。
- 如果需要取最大或最小元素，使用`PriorityQueue`（默认最小堆），还可自定义比较器：

```java
Queue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
```

------

## 🎯 快速记忆：

| 常规操作 | 推荐方法组合 |
| -------- | ------------ |
| 入队     | `offer(e)`   |
| 出队     | `poll()`     |
| 查看队头 | `peek()`     |

<Artalk />