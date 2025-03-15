# 📌《每天搞懂一个JDK源码》之HashMap解读
🔗源码定位：java.util.HashMap（建议IDE对照阅读）

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250301234723624.png" alt="image-20250301234723624" style="zoom: 50%;" />

今天我们来破解Java集合框架中最精妙的艺术品——HashMap！它不仅是面试必考题（出现率99%），更是理解数据结构设计的绝佳范例。准备好了吗？让我们开启这段源码探险之旅！🚀

---

### 🧩 源码全景地图（JDK1.8版）
```java
// 🌈 核心数据结构
transient Node<K,V>[] table; // 哈希桶数组（长度总是2的幂）
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash; // 🧬 关键字段1：扰动后的哈希值
    final K key;    // 🧬 关键字段2
    V value;
    Node<K,V> next; // 1.8保留链表结构
}

// 🌳 红黑树节点（当链表长度≥8时转换）
static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
    TreeNode<K,V> parent;  
    TreeNode<K,V> left;
    TreeNode<K,V> right;
    TreeNode<K,V> prev;    // 维持双向链表特性
}
```

---

### 🔥 核心实现原理

#### 💡 哈希算法演进史
```java
// JDK1.7的扰动函数（4次位运算+5次异或）
h ^= (h >>> 20) ^ (h >>> 12);
return h ^ (h >>> 7) ^ (h >>> 4);

// JDK1.8优化（1次位运算+1次异或）
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```
*（图示：扰动函数将高位特征融入低位，减少哈希碰撞）*

---

#### ⚔️ 哈希冲突解决方案对比
| 特性     | JDK1.7                   | JDK1.8                 |
| -------- | ------------------------ | ---------------------- |
| 数据结构 | 数组+单向链表            | 数组+链表/红黑树       |
| 插入方式 | 头插法（多线程成环风险） | 尾插法（解决死链问题） |
| 树化阈值 | 无                       | 链表长度≥8且桶数量≥64  |
| 退化阈值 | 无                       | 树节点≤6时退化为链表   |

---

#### 🌪️ 扩容机制源码解析（JDK1.8）
```java
final Node<K,V>[] resize() {
    // 旧容量翻倍（必须保持2的幂）
    newCap = oldCap << 1; 
    
    // 重新分配节点（精妙之处！）
    if (e.next == null) // 单节点
        newTab[e.hash & (newCap - 1)] = e;
    else if (e instanceof TreeNode) // 树节点拆分
        ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
    else { // 链表优化重组（不需要重新计算哈希！）
        Node<K,V> loHead = null, loTail = null; // 低位链
        Node<K,V> hiHead = null, hiTail = null; // 高位链
        do {
            // 判断是否需要移动的魔法公式：
            if ((e.hash & oldCap) == 0) { ... }
        } while ((e = next) != null);
    }
}
```
*（扩容时链表节点通过`hash & oldCap`判断是否需要移动，时间复杂度从O(n)降为O(1)）*

---

#### 🧩 扩容过程介绍

> 截自某平台的的评论区

![image-20250301234914645](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250301234914645.png)

### 🚨 并发问题深度警示

```java
// JDK1.7头插法导致死链的典型场景
void transfer(Entry[] newTable) {
    Entry<K,V> e = src[j];
    while (e != null) {
        Entry<K,V> next = e.next;
        int i = indexFor(e.hash, newCapacity); 
        e.next = newTable[i]; // ❌多线程可能形成循环引用
        newTable[i] = e;
        e = next;
    }
}
```
*（1.8改用尾插法+红黑树重组策略，但HashMap仍是非线程安全的！）*

---

### 🎯 高频面试题精选
1. 为什么负载因子默认0.75？（空间与时间的平衡点）
2. 为什么树化阈值是8？（泊松分布计算，链表长度=8的概率仅0.000006%）
3. 为什么用红黑树不用AVL树？（综合查询与更新效率）
4. 为什么容量必须是2的幂？（通过`(n-1) & hash`快速定位桶）

---

### 🌟 版本对比总结表
| 对比维度       | JDK1.7           | JDK1.8                  |
| -------------- | ---------------- | ----------------------- |
| 数据结构       | 数组+链表        | 数组+链表/红黑树        |
| 哈希计算       | 9次位扰动        | 2次位扰动               |
| 节点插入       | 头插法           | 尾插法                  |
| 扩容后索引计算 | 全部重新计算hash | 利用高位bit判断         |
| 最大容量       | 1<<30            | 1<<30（但实际受VM限制） |

---

### 🔍 LeetCode实战推荐
1. [两数之和](https://leetcode.com/problems/two-sum/)（HashMap经典应用）
2. [设计哈希集合](https://leetcode.com/problems/design-hashset/)（实现原理练习）
3. [LRU缓存机制](https://leetcode.com/problems/lru-cache/)（LinkedHashMap实战）
4. [字母异位词分组](https://leetcode.com/problems/group-anagrams/)（哈希设计技巧） 

💬 灵魂拷问：为什么HashMap的树化不直接采用整个哈希表结构树化？欢迎在评论区留下你的思考！💡  🚀 下期关键词预告：#线程安全 #CAS机制 #分段锁 #并发度优化 #sizeCtl控制
<Artalk />