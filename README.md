# 一个简单的基于koa.js的mvc框架

koa.js提供了中间件的思想，具体的server实现还是由程序员自己去构建，参考各种主流框架，本项目用简单的代码来定义一个具有实践价值、可成长的node后端框架

## 技术实现

- 定义app大对象，启动时挂载所有组件
- 定义目录规范， eg, controller,model,service,middleware,libary
- 松散的模块化，功能模块可以灵活地加入与组合
- 除了http协议，还加入mqtt协议的模块, 模仿http实现了路由，中间件等组件
- 优雅的进程退出，当收到SIGINT信号，按顺序关闭http,mqtt,mysql服务，使已经接收到的请求（业务逻辑）处理完与保存数据再退出。建议类似pm2的进程管理（关闭进程的模式是先发SIGINT且等待1.6s若进程未亡则发SIGKILL强制退出）

## 贡献名单

- [lightfish-zhang](https://github.com/lightfish-zhang)