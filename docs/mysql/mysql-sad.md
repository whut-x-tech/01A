#  📚 MySQL悲观锁深度解析 | 从原理到实战避坑指南 

---

### 🌟 什么是悲观锁？
"先下手为强！"——这就是悲观锁的核心思想。它默认所有操作都可能发生并发冲突，在操作数据前会先加锁，确保独占访问。在MySQL中，**默认的悲观锁是表级锁**，但通过特定方式可实现更细粒度的行级锁。

---

### 🔑 行级锁开启双条件（缺一不可）
1. **🎯 索引字段操作**  
   必须对建立索引的字段（如`product_code`）进行查询/更新，否则自动降级为表锁  
   → `EXPLAIN`命令可验证是否走索引

2. **🔢 精确值匹配**  
   必须使用`=`等精确匹配操作符  
   ❌ 禁用模糊查询（LIKE）和范围查询（!=, >, <）

<hr>

###  🔒悲观锁解决的问题：

- 同一个商品有多个记录的时候
- **无法记录更新前后的变化的问题**

---

### 💻 核心语法解析
```mysql
SELECT * FROM tb_stock 
WHERE product_code = '1002' FOR UPDATE;  -- 关键锁定语句
```
✅ 正确姿势：  
- 确保`product_code`字段有索引  
- 明确指定具体值（'1002'）

❌ 错误示范：  
```mysql
SELECT * FROM tb_stock WHERE product_code LIKE '100%' FOR UPDATE;  -- 触发表锁！
```

---

### 🛠️ 实战代码示例

#### Java 服务层
```java
@Transactional  // 事务注解保证原子性
public void deduct() {
    // 🚨 注意：必须确保所有查询走同一索引，避免死锁
    List<Stock> stocks = stockMapper.queryStock("1002");
    
    Stock stock = stocks.stream()
                       .findFirst()
                       .orElseThrow(() -> new RuntimeException("库存不存在"));
    
    if (stock.getCount() > 0) {
        stock.setCount(stock.getCount() - 1);
        stockMapper.updateById(stock);
    }
}
```

#### MyBatis Mapper
```java
public interface StockMapper extends BaseMapper<Stock> {
    @Select("SELECT * FROM tb_stock WHERE product_code = #{productCode} FOR UPDATE")
    List<Stock> queryStock(@Param("productCode") String productCode);
}
```

![image-20250302162511332](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250302162511332.png)


---

### ⚠️ 悲观锁三大痛点
1. **🐢 性能瓶颈**  
   长时间锁持有导致并发吞吐量下降（实测QPS仅约10）

   ![image-20250302162605784](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250302162605784.png)

2. **💀 死锁风险**  
   当多个事务以不同顺序加锁时，可能产生环形等待  
   **👉 解决方案**：统一加锁顺序 + 设置锁超时时间

3. **📦 库存热点问题**  
   高频操作同一商品时容易成为系统瓶颈

---

### 🧪 压测验证
**测试配置**  
- 初始库存：5000  
- 并发线程：100  
- 循环次数：50次/线程  

**结果分析**  
✅ 最终库存准确归零  
📉 QPS对比：  

| 锁类型    | QPS   |
| --------- | ----- |
| 无锁      | 1500+ |
| 悲观锁    | ~10   |
| JVM本地锁 | ~8    |

---

### 💡 最佳实践指南
1. **索引检查双保险**  
   ```mysql
   SHOW INDEX FROM tb_stock;  -- 查看索引
   EXPLAIN SELECT ... FOR UPDATE;  -- 验证执行计划
   ```

2. **锁超时设置**  
   ```mysql
   SET innodb_lock_wait_timeout = 3;  -- 设置3秒锁等待超时
   ```

3. **监控利器**  
   ```mysql
   SHOW ENGINE INNODB STATUS;  -- 查看死锁日志
   ```

4. **库存操作黄金法则**  
   - 统一where条件字段  
   - 更新条件包含版本号/原库存值  
   - 事务尽量短小精悍

---

### 📚 知识扩展
**悲观锁 vs 乐观锁**  
|          | 悲观锁              | 乐观锁             |
| -------- | ------------------- | ------------------ |
| 适用场景 | 高冲突写操作        | 低冲突读多写少     |
| 实现方式 | SELECT...FOR UPDATE | 版本号/CAS         |
| 性能特点 | 实时性高，吞吐量低  | 延迟检测，吞吐量高 |

---

🔚 **总结**：悲观锁是解决并发问题的重型武器，使用时需精准把控索引条件和事务范围。在高并发场景下，建议结合Redis分布式锁或乐观锁方案，根据业务特点选择最优解！

<Artalk />