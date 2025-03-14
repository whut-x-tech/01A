#!/bin/bash

# 增强版脚本：构建VitePress文档并重启Nginx

# 定义颜色代码
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # 重置颜色

# 配置参数（按需修改）
PROJECT_DIR="."  # 项目根目录
DOCS_DIR="docs"                        # 文档目录相对路径

#######################################
# 前置检查模块
#######################################
precheck() {
    # 检查Node.js环境
    if ! command -v node &> /dev/null; then
        echo -e "${RED}✗ Node.js未安装！请先安装Node.js${NC}"
        exit 1
    fi

    # 检查pnpm安装
    if ! command -v pnpm &> /dev/null; then
        echo -e "${RED}✗ pnpm未安装！执行自动安装...${NC}"
        npm install -g pnpm || {
            echo -e "${RED}pnpm安装失败！请手动安装：npm install -g pnpm${NC}"
            exit 1
        }
    fi

    # 检查项目目录
    if [ ! -d "${PROJECT_DIR}" ]; then
        echo -e "${RED}✗ 项目目录不存在：${CYAN}${PROJECT_DIR}${NC}"
        exit 1
    fi

    # 检查文档目录
    if [ ! -d "${PROJECT_DIR}/${DOCS_DIR}" ]; then
        echo -e "${RED}✗ 文档目录不存在：${CYAN}${PROJECT_DIR}/${DOCS_DIR}${NC}"
        exit 1
    fi
}

#######################################
# 构建文档模块
#######################################
build_docs() {
    echo -e "${YELLOW}▶ 正在构建文档...${NC}"
    
    # 进入项目目录
    cd "${PROJECT_DIR}" || exit 1

    # 安装依赖（可选）
    if [ ! -d "node_modules" ]; then
        echo -e "${CYAN}➤ 检测到未安装依赖，执行安装...${NC}"
        pnpm install || {
            echo -e "${RED}✗ 依赖安装失败！${NC}"
            exit 1
        }
    fi

    # 执行构建
    pnpm exec vitepress build "${DOCS_DIR}"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ 文档构建失败！请检查以下方面：${NC}"
        echo "1. 查看构建错误日志"
        echo "2. 确认vitepress配置正确性"
        echo "3. 检查Markdown文件语法"
        exit 1
    fi
    
    echo -e "${GREEN}✓ 文档构建完成！${NC}"
}

#######################################
# Nginx控制模块
#######################################
restart_nginx() {
    # 检查Nginx是否安装
    if ! command -v nginx &> /dev/null; then
        echo -e "${RED}✗ Nginx未安装！请先执行安装：${NC}"
        echo "sudo apt update && sudo apt install nginx"
        exit 1
    fi

    # 权限检查
    if [ "$EUID" -ne 0 ]; then
        echo -e "${YELLOW}⚠ 需要管理员权限执行Nginx操作...${NC}"
        exec sudo "$0" "$@"
    fi

    # 重启Nginx
    echo -e "${YELLOW}▶ 正在重启Nginx服务...${NC}"
    systemctl restart nginx

    # 结果验证
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Nginx重启成功！${NC}"
        echo -e "当前状态："
        systemctl status nginx --no-pager | grep -E "Active:|Main PID:"
    else
        echo -e "${RED}✗ Nginx重启失败！可能原因：${NC}"
        echo "1. 配置文件存在语法错误（执行 nginx -t 检查）"
        echo "2. 端口被占用（执行 lsof -i :80 检查）"
        echo "3. 构建产物权限问题（检查 ${PROJECT_DIR}/.vitepress/dist 目录权限）"
        exit 1
    fi
}

#######################################
# 主执行流程
#######################################
main() {
    precheck       # 前置检查
    build_docs     # 文档构建
    restart_nginx  # 服务重启
    
    echo -e "\n${GREEN}✅ 全流程执行完毕！${NC}"
    echo -e "访问地址：${CYAN}http://localhost/${NC}"
}

# 执行主函数
main
