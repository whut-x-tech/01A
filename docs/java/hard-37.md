# 📌《每天搞懂一道Hard》之数独终结者（LeetCode 37）
🔗原题链接：https://leetcode.com/problems/sudoku-solver/

今天我们来解剖一个经典回溯算法问题——数独求解器！这道题在算法面试中出现频率高达35%（数据来源：LeetCode高频榜单），是检验回溯功力的试金石。准备好迎接烧脑之旅了吗？🚀

---

### 🧩 代码全景透视
```java
class Solution {
    public void solveSudoku(char[][] board) {
        backtrack(board,0,0); // 🚪算法入口
    }

    boolean backtrack(char[][]board,int i,int j){
        int m = 9, n = 9;
        
        // 🛑 边界处理三连击
        if(j == n) return backtrack(board,i+1,0); // 🌐列越界换行
        if(i == m) return true; // 🎉找到解
        if(board[i][j] != '.') return backtrack(board,i,j+1); // ⏭跳过已填数字

        for(char ch = '1'; ch <= '9'; ch++){ // 🔄尝试所有可能性
            if(!isValid(board,i,j,ch)) continue; // 🚫剪枝操作
            
            board[i][j] = ch; // ✍️做选择
            if(backtrack(board,i,j+1)) return true; // 🏃♂️递归深入
            board[i][j] = '.'; // ↩️撤销选择
        }
        return false; // 😢当前路径无解
    }

    boolean isValid(char[][]board,int r,int c,char n){
        // ✅三重验证体系
        for(int i=0;i<9;i++){
            if(board[r][i]==n) return false; // 🚦行检查
            if(board[i][c]==n) return false; // 🚦列检查
            if(board[(r/3)*3+i/3][(c/3)*3+i%3]==n) return false; // 📦九宫格检查
        }
        return true;
    }
}
```

![image-20250301233757424](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250301233757424.png)


---

### 🔥 核心知识熔炉

#### 💡 回溯算法框架
1. **路径选择**：遍历1-9所有可能性
2. **约束条件**：通过isValid()剪枝
3. **递归终止**：当行指针i越界时（i==9）
4. **时间复杂度**：O(9^m) 其中m是空白格数，实际通过剪枝大幅优化

#### 🧠 九宫格定位秘籍
```java
// 🧊 九宫格起点计算
int boxRow = (r/3)*3;  // 如r=5 → 5/3=1 → 1*3=3
int boxCol = (c/3)*3;  // 如c=4 → 4/3=1 → 1*3=3

// 🧭 遍历技巧
for(int i=0; i<9; i++){
    int actualRow = boxRow + i/3;  // 行偏移量
    int actualCol = boxCol + i%3;  // 列偏移量
}
```

#### ⚠️ 易错点警报
1. **回溯返回值处理**：找到解立即返回，避免覆盖正确解
2. **修改原数组后恢复**：必须重置为'.'，否则影响其他分支
3. **索引计算陷阱**：九宫格遍历时注意i/3与i%3的配合

---

### 🎯 举一反三训练
1. [N皇后问题](https://leetcode.com/problems/n-queens/)（回溯经典变种）
2. [有效数独验证](https://leetcode.com/problems/valid-sudoku/)（本题前置练习）
3. [单词搜索](https://leetcode.com/problems/word-search/)（二维矩阵回溯）
4. [组合总和](https://leetcode.com/problems/combination-sum/)（一维回溯练习）

---

### 🌟 高手进阶技巧
1. **舞蹈链算法**：数独的最优解法（Donald Knuth提出）
2. **剪枝优化**：优先填充候选数少的格子
3. **位运算加速**：用bitmask记录可用数字
4. **并行计算**：对独立区域进行并行求解（面试加分项！）

💬 互动思考：如果把数独扩展到16×16网格，算法需要做哪些调整？欢迎在评论区分享你的见解！💡

<Artalk />