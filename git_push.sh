#!/bin/bash

# 定义颜色代码
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # 颜色重置

# 提示用户输入 commit message
echo -e "${CYAN}请输入 Git 提交信息：${NC}"
read -r COMMIT_MESSAGE

# 如果用户没有输入，使用默认信息
if [ -z "$COMMIT_MESSAGE" ]; then
	    COMMIT_MESSAGE="Auto commit: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 显示提交信息
echo -e "${GREEN}🚀 Git 自动提交 & 推送${NC}"
echo -e "${CYAN}提交信息: ${COMMIT_MESSAGE}${NC}"

# 执行 Git 命令
git add .
git commit -m "$COMMIT_MESSAGE"

# 检查 commit 是否成功
if [ $? -ne 0 ]; then
	    echo -e "${RED}❌ Git commit 失败，请检查是否有变更需要提交。${NC}"
	        exit 1
fi

# 推送到远程仓库
git push

# 检查 push 是否成功
if [ $? -eq 0 ]; then
	    echo -e "${GREEN}✅ Git 推送成功！${NC}"
    else
	        echo -e "${RED}❌ Git 推送失败，请检查远程仓库或网络连接。${NC}"
		    exit 1
fi

