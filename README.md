# FocusTimer (专注计时器)

A modern desktop focus timer application built with Tauri + React + TypeScript + Rust, designed for productivity and time management.

一个基于 Tauri + React + TypeScript + Rust 开发的桌面专注计时应用。

## ✨ Features / 功能特性

### 🎯 Task Management / 任务管理
- **Task Group Management**: Create, edit, and delete task groups (e.g., "English Learning", "Work Projects")
- **Task Management**: Create, edit, and delete specific tasks within groups
- **Flexible Timing**: Support for preset times (25min, 30min, 45min, 1hr) and custom durations
- **Forward Timer**: Unlimited forward timing mode for tracking actual time spent

- **任务组管理**: 创建、编辑、删除任务组（如"英语学习"、"工作项目"等）
- **任务管理**: 在任务组内创建、编辑、删除具体任务
- **灵活计时**: 支持预设时间（25分钟、30分钟、45分钟、1小时）和自定义时间
- **正向计时**: 支持无限制的正向计时模式

### ⏰ Timer Functionality / 计时功能
- **Countdown Mode**: Set fixed time duration with countdown to zero
- **Forward Timer Mode**: Unlimited timing to record actual time spent
- **Real-time Display**: Large font display of current time
- **Progress Bar**: Visual progress indicator for countdown mode
- **Control Functions**: Pause, resume, stop, and reset functionality

- **倒计时模式**: 设置固定时间，倒计时到零
- **正向计时模式**: 无限制计时，记录实际用时
- **实时显示**: 大字体显示当前时间
- **进度条**: 倒计时模式下显示完成进度
- **控制功能**: 暂停、继续、停止、重置

### 📊 Statistics & Reports / 统计报告
- **Multi-period Statistics**: Today, this week, last 15 days, this month, custom date range
- **Multi-dimensional Analysis**: Statistics by task or by task group
- **Detailed Metrics**: Total duration, session count, completion rate
- **Visual Display**: Progress bars showing completion rates
- **📈 Pie Chart Visualization**: Interactive pie charts showing time distribution across tasks
- **Dual View Modes**: Switch between chart view and list view for different perspectives

- **多周期统计**: 今天、本周、近15天、本月、自定义时间范围
- **多维度分析**: 按任务统计或按任务组统计
- **详细指标**: 总时长、会话数、完成率等
- **可视化展示**: 进度条显示完成率
- **📈 饼图可视化**: 交互式饼图展示各任务时长占比
- **双视图模式**: 可在图表视图和列表视图之间切换

## 🛠️ Tech Stack / 技术栈

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Rust + Tauri 2
- **Database**: SQLite + SQLx
- **UI Components**: Lucide React icons
- **Data Visualization**: Recharts
- **Date Processing**: date-fns

- **前端**: React 19 + TypeScript + Vite
- **后端**: Rust + Tauri 2
- **数据库**: SQLite + SQLx
- **UI组件**: Lucide React 图标
- **数据可视化**: Recharts
- **日期处理**: date-fns

## 📋 Prerequisites / 开发环境要求

- Node.js 18+
- Rust 1.70+
- Tauri CLI 2.0+

## 🚀 Installation & Setup / 安装和运行

1. **Install dependencies / 安装依赖**:
```bash
npm install
```

2. **Run in development mode / 开发模式运行**:
```bash
npm run tauri dev
```

3. **Build for production / 构建生产版本**:
```bash
npm run tauri build
```

## 📖 Usage Guide / 使用说明

> 📚 **Detailed Usage Guide**: For comprehensive usage instructions, screenshots, and troubleshooting, please refer to the [USAGE.md](USAGE.md) file.
> 
> 📚 **详细使用说明**: 如需查看完整的使用说明、截图和故障排除，请参考 [USAGE.md](USAGE.md) 文件。

### Quick Start / 快速开始

#### 1. Create Task Groups / 创建任务组
- Click the "New Task Group" button / 点击"新建任务组"按钮
- Enter task group name and description / 输入任务组名称和描述
- Example: Create "English Learning" task group / 例如：创建"英语学习"任务组

#### 2. Add Tasks / 添加任务
- Select a task group / 选择任务组
- Click "New Task" button / 点击"新建任务"按钮
- Set task name, description, and timing mode / 设置任务名称、描述和计时方式：
  - **Preset Time**: Choose 25min, 30min, 45min, or 1hr / **预设时间**: 选择25分钟、30分钟、45分钟或1小时
  - **Custom Time**: Enter any number of minutes / **自定义时间**: 输入任意分钟数
  - **Forward Timer**: No time limit, records actual time spent / **正向计时**: 无时间限制，记录实际用时

#### 3. Start Timing / 开始计时
- Click "Start" button in the task list / 在任务列表中点击"开始"按钮
- Automatically switches to timer interface / 自动切换到计时器界面
- Use control buttons to manage timing process / 使用控制按钮管理计时过程

#### 4. View Statistics / 查看统计
- Switch to "Statistics" tab / 切换到"统计报告"标签
- Select time period (today, this week, last 15 days, this month, or custom) / 选择统计周期（今天、本周、近15天、本月或自定义）
- Choose grouping method (by task or by task group) / 选择统计方式（按任务或按任务组）
- **📊 Toggle between Chart View and List View** / **📊 在图表视图和列表视图之间切换**
  - **Chart View**: Interactive pie chart showing time distribution / **图表视图**: 交互式饼图展示时长分布
  - **List View**: Detailed statistics with metrics / **列表视图**: 详细的统计指标
- Hover over pie chart segments to see detailed information / 鼠标悬停在饼图扇形上查看详细信息
- View detailed learning/work time statistics / 查看详细的学习/工作时间统计

### Advanced Features / 高级功能

#### 🎨 Background Customization / 背景自定义
- Customize timer background colors and images / 自定义计时器背景颜色和图片
- Support for solid colors, gradients, and image uploads / 支持纯色、渐变和图片上传
- Different backgrounds for running and paused states / 运行和暂停状态的不同背景

#### 🌍 Multilingual Support / 多语言支持
- Switch between Chinese and English interfaces / 在中英文界面之间切换
- All UI elements support both languages / 所有UI元素都支持双语
- Language preference saved automatically / 语言偏好自动保存

#### ⚙️ Settings & Configuration / 设置和配置
- Access settings through the Settings tab / 通过设置标签访问设置
- Customize timer appearance and behavior / 自定义计时器外观和行为
- Manage language preferences / 管理语言偏好

## 🗄️ Database Structure / 数据库结构

The application uses SQLite database to store data with the following tables:

应用使用 SQLite 数据库存储数据，包含以下表：

- `task_groups`: Task group information / 任务组信息
- `tasks`: Task information / 任务信息
- `task_sessions`: Timer session records / 计时会话记录

## 📁 Project Structure / 项目结构

```
src-tauri/
├── src/
│   ├── main.rs          # Application entry point / 应用入口
│   ├── lib.rs           # Tauri commands and configuration / Tauri 命令和配置
│   ├── models.rs        # Data model definitions / 数据模型定义
│   └── database.rs      # Database operations / 数据库操作
src/
├── components/          # React components / React 组件
│   ├── TaskGroupManager.tsx
│   ├── TaskManager.tsx
│   ├── Timer.tsx
│   └── Statistics.tsx
├── services/
│   └── api.ts          # API services / API 服务
├── utils/
│   └── helpers.ts      # Utility functions / 工具函数
├── types.ts            # TypeScript type definitions / TypeScript 类型定义
└── App.tsx             # Main application component / 主应用组件
```

## 🌟 Key Features / 特色功能

- **Modern UI**: Clean and beautiful interface design / **现代化 UI**: 简洁美观的界面设计
- **Responsive Layout**: Adapts to different screen sizes / **响应式布局**: 适配不同屏幕尺寸
- **Real-time Sync**: Frontend and backend data synchronization / **实时同步**: 前后端数据实时同步
- **Data Persistence**: Local SQLite database storage / **数据持久化**: 本地 SQLite 数据库存储
- **Cross-platform**: Supports Windows, macOS, Linux / **跨平台**: 支持 Windows、macOS、Linux

## 🔧 Development Notes / 开发说明

- Built with Tauri 2.0 latest version / 使用 Tauri 2.0 最新版本
- Supports hot reload development / 支持热重载开发
- TypeScript strict mode enabled / TypeScript 严格模式
- Rust async programming / Rust 异步编程
- SQLx type-safe database operations / SQLx 类型安全数据库操作

## 📸 Screenshots / 截图

> 📷 **Project Screenshots**: View detailed application screenshots in the [screenshots/](screenshots/) directory and [USAGE.md](USAGE.md) file.
> 
> 📷 **项目截图**: 在 [screenshots/](screenshots/) 目录和 [USAGE.md](USAGE.md) 文件中查看详细的应用程序截图。

### Available Screenshots / 可用截图

- **Main Interface** / **主界面**: Task group and task management features
- **Timer Interface** / **计时器界面**: Countdown and forward timing modes
- **Timer Paused Interface** / **计时器暂停界面**: Paused state with custom background
- **Statistics Report** / **统计报告**: Detailed time analysis and metrics
- **Statistics Chart View** / **统计图表视图**: Pie chart visualization of time distribution
- **Settings Interface** / **设置界面**: Background customization and language settings
- **Language Setting** / **语言设置**: Multilingual support demonstration

### Current Screenshots / 当前截图

The following screenshots are currently available in the `screenshots/` directory:

以下截图目前在 `screenshots/` 目录中可用：

- `main-interface.png` - Main application interface
- `timer.png` - Timer interface in running state
- `timer-paused.png` - Timer interface in paused state
- `statistics-report.png` - Statistics and analytics view (list view)
- `statistics-chart.png` - Statistics pie chart view (NEW)
- `settings-interface.png` - Settings and customization panel
- `language-setting.png` - Language selection interface

## 🤝 Contributing / 贡献

Contributions are welcome! Please feel free to submit a Pull Request.

欢迎贡献！请随时提交 Pull Request。

## 📄 License / 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT License

## 🙏 Acknowledgments / 致谢

- Built with [Tauri](https://tauri.app/)
- UI icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- Date handling by [date-fns](https://date-fns.org/)

---

**Made with ❤️ for productivity enthusiasts**

**为效率爱好者而制作 ❤️**