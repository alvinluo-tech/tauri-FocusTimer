# FocusTimer

A modern desktop focus timer application built with Tauri + React + TypeScript + Rust, designed for productivity and time management.

## ✨ Features

### 🎯 Task Management
- **Task Group Management**: Create, edit, and delete task groups (e.g., "English Learning", "Work Projects")
- **Task Management**: Create, edit, and delete specific tasks within groups
- **Flexible Timing**: Support for preset times (25min, 30min, 45min, 1hr) and custom durations
- **Forward Timer**: Unlimited forward timing mode for tracking actual time spent

### ⏰ Timer Functionality
- **Countdown Mode**: Set fixed time duration with countdown to zero
- **Forward Timer Mode**: Unlimited timing to record actual time spent
- **Real-time Display**: Large font display of current time
- **Progress Bar**: Visual progress indicator for countdown mode
- **Control Functions**: Pause, resume, stop, and reset functionality

### 📊 Statistics & Reports
- **Multi-period Statistics**: Today, this week, last 15 days, this month, custom date range
- **Multi-dimensional Analysis**: Statistics by task or by task group
- **Detailed Metrics**: Total duration, session count, completion rate
- **Visual Display**: Progress bars showing completion rates

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Rust + Tauri 2
- **Database**: SQLite + SQLx
- **UI Components**: Lucide React icons
- **Date Processing**: date-fns

## 📋 Prerequisites

- Node.js 18+
- Rust 1.70+
- Tauri CLI 2.0+

## 🚀 Installation & Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Run in development mode**:
```bash
npm run tauri dev
```

3. **Build for production**:
```bash
npm run tauri build
```

## 📖 Usage Guide

### 1. Create Task Groups
- Click the "New Task Group" button
- Enter task group name and description
- Example: Create "English Learning" task group

### 2. Add Tasks
- Select a task group
- Click "New Task" button
- Set task name, description, and timing mode:
  - **Preset Time**: Choose 25min, 30min, 45min, or 1hr
  - **Custom Time**: Enter any number of minutes
  - **Forward Timer**: No time limit, records actual time spent

### 3. Start Timing
- Click "Start" button in the task list
- Automatically switches to timer interface
- Use control buttons to manage timing process

### 4. View Statistics
- Switch to "Statistics" tab
- Select time period (today, this week, last 15 days, this month, or custom)
- Choose grouping method (by task or by task group)
- View detailed learning/work time statistics

## 🗄️ Database Structure

The application uses SQLite database to store data with the following tables:

- `task_groups`: Task group information
- `tasks`: Task information
- `task_sessions`: Timer session records

## 📁 Project Structure

```
src-tauri/
├── src/
│   ├── main.rs          # Application entry point
│   ├── lib.rs           # Tauri commands and configuration
│   ├── models.rs        # Data model definitions
│   └── database.rs      # Database operations
src/
├── components/          # React components
│   ├── TaskGroupManager.tsx
│   ├── TaskManager.tsx
│   ├── Timer.tsx
│   └── Statistics.tsx
├── services/
│   └── api.ts          # API services
├── utils/
│   └── helpers.ts      # Utility functions
├── types.ts            # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🌟 Key Features

- **Modern UI**: Clean and beautiful interface design
- **Responsive Layout**: Adapts to different screen sizes
- **Real-time Sync**: Frontend and backend data synchronization
- **Data Persistence**: Local SQLite database storage
- **Cross-platform**: Supports Windows, macOS, Linux

## 🔧 Development Notes

- Built with Tauri 2.0 latest version
- Supports hot reload development
- TypeScript strict mode enabled
- Rust async programming
- SQLx type-safe database operations

## 📸 Screenshots

*Screenshots would be added here to showcase the application interface*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/)
- UI icons by [Lucide](https://lucide.dev/)
- Date handling by [date-fns](https://date-fns.org/)

---

**Made with ❤️ for productivity enthusiasts**
