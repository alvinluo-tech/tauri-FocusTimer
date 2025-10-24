export type Language = 'zh' | 'en';

export interface Translations {
  // App
  appTitle: string;
  
  // Navigation
  tasks: string;
  timer: string;
  statistics: string;
  settings: string;
  
  // Task Management
  taskGroups: string;
  newTaskGroup: string;
  taskGroupName: string;
  description: string;
  optional: string;
  create: string;
  update: string;
  cancel: string;
  delete: string;
  confirmDelete: string;
  noTaskGroups: string;
  createFirstTaskGroup: string;
  
  // Tasks
  newTask: string;
  taskName: string;
  presetTime: string;
  customTime: string;
  forwardTimer: string;
  minutes: string;
  hour: string;
  start: string;
  edit: string;
  noTasks: string;
  selectTaskGroupFirst: string;
  timerMode: string;
  
  // Timer
  countdown: string;
  selectTaskToStart: string;
  pause: string;
  resume: string;
  stop: string;
  reset: string;
  
  // Statistics
  today: string;
  thisWeek: string;
  last15Days: string;
  thisMonth: string;
  custom: string;
  byTask: string;
  byTaskGroup: string;
  totalDuration: string;
  sessions: string;
  completionRate: string;
  noData: string;
  statisticsPeriod: string;
  startDate: string;
  to: string;
  endDate: string;
  taskCount: string;
  statisticsMethod: string;
  byTaskStatistics: string;
  byTaskGroupStatistics: string;
  
  // Settings
  customizeTimerBackground: string;
  runningBackground: string;
  pausedBackground: string;
  previewEffect: string;
  running: string;
  paused: string;
  backgroundType: string;
  solidColor: string;
  imageBackground: string;
  selectColor: string;
  uploadImage: string;
  chooseImage: string;
  currentImage: string;
  resetToDefault: string;
  saveConfiguration: string;
  settingsSaved: string;
  
  // Color Picker
  solid: string;
  gradient: string;
  advanced: string;
  preview: string;
  enableOpacity: string;
  opacity: string;
  basicColors: string;
  warmColors: string;
  coolColors: string;
  neutralColors: string;
  
  // Common
  confirm: string;
  save: string;
  add: string;
  remove: string;
  close: string;
  loading: string;
  error: string;
  success: string;
}

export const translations: Record<Language, Translations> = {
  zh: {
    // App
    appTitle: 'FocusTimer',
    
    // Navigation
    tasks: '任务管理',
    timer: '计时器',
    statistics: '统计报告',
    settings: '设置',
    
    // Task Management
    taskGroups: '任务组',
    newTaskGroup: '新建任务组',
    taskGroupName: '任务组名称',
    description: '描述',
    optional: '（可选）',
    create: '创建',
    update: '更新',
    cancel: '取消',
    delete: '删除',
    confirmDelete: '确定要删除这个任务组吗？这将删除组内的所有任务。',
    noTaskGroups: '还没有任务组',
    createFirstTaskGroup: '点击上方按钮创建第一个任务组',
    
    // Tasks
    newTask: '新建任务',
    taskName: '任务名称',
    presetTime: '预设时间',
    customTime: '自定义时间',
    forwardTimer: '正向计时',
    minutes: '分钟',
    hour: '小时',
    start: '开始',
    edit: '编辑',
    noTasks: '还没有任务',
    selectTaskGroupFirst: '请先选择任务组',
    timerMode: '计时方式',
    
    // Timer
    countdown: '倒计时',
    selectTaskToStart: '选择任务开始计时',
    pause: '暂停',
    resume: '继续',
    stop: '停止',
    reset: '重置',
    
    // Statistics
    today: '今天',
    thisWeek: '本周',
    last15Days: '近15天',
    thisMonth: '本月',
    custom: '自定义',
    byTask: '按任务',
    byTaskGroup: '按任务组',
    totalDuration: '总时长',
    sessions: '会话数',
    completionRate: '完成率',
    noData: '暂无数据',
    statisticsPeriod: '统计周期',
    startDate: '开始日期',
    to: '至',
    endDate: '结束日期',
    taskCount: '任务数',
    statisticsMethod: '统计方式',
    byTaskStatistics: '按任务统计',
    byTaskGroupStatistics: '按任务组统计',
    
    // Settings
    customizeTimerBackground: '自定义计时器背景颜色和图片',
    runningBackground: '运行中背景',
    pausedBackground: '暂停背景',
    previewEffect: '预览效果',
    running: '运行中',
    paused: '暂停中',
    backgroundType: '背景类型',
    solidColor: '纯色背景',
    imageBackground: '图片背景',
    selectColor: '选择颜色',
    uploadImage: '上传图片',
    chooseImage: '选择图片',
    currentImage: '当前图片',
    resetToDefault: '重置为默认',
    saveConfiguration: '保存配置',
    settingsSaved: '设置已保存！',
    
    // Color Picker
    solid: '纯色',
    gradient: '渐变',
    advanced: '高级',
    preview: '预览',
    enableOpacity: '启用透明度',
    opacity: '透明度',
    basicColors: '基础色',
    warmColors: '暖色调',
    coolColors: '冷色调',
    neutralColors: '中性色',
    
    // Common
    confirm: '确认',
    save: '保存',
    add: '添加',
    remove: '移除',
    close: '关闭',
    loading: '加载中',
    error: '错误',
    success: '成功',
  },
  
  en: {
    // App
    appTitle: 'FocusTimer',
    
    // Navigation
    tasks: 'Tasks',
    timer: 'Timer',
    statistics: 'Statistics',
    settings: 'Settings',
    
    // Task Management
    taskGroups: 'Task Groups',
    newTaskGroup: 'New Task Group',
    taskGroupName: 'Task Group Name',
    description: 'Description',
    optional: '(Optional)',
    create: 'Create',
    update: 'Update',
    cancel: 'Cancel',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this task group? This will delete all tasks in the group.',
    noTaskGroups: 'No task groups yet',
    createFirstTaskGroup: 'Click the button above to create your first task group',
    
    // Tasks
    newTask: 'New Task',
    taskName: 'Task Name',
    presetTime: 'Preset Time',
    customTime: 'Custom Time',
    forwardTimer: 'Forward Timer',
    minutes: 'minutes',
    hour: 'hour',
    start: 'Start',
    edit: 'Edit',
    noTasks: 'No tasks yet',
    selectTaskGroupFirst: 'Please select a task group first',
    timerMode: 'Timer Mode',
    
    // Timer
    countdown: 'Countdown',
    selectTaskToStart: 'Select a task to start timing',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    reset: 'Reset',
    
    // Statistics
    today: 'Today',
    thisWeek: 'This Week',
    last15Days: 'Last 15 Days',
    thisMonth: 'This Month',
    custom: 'Custom',
    byTask: 'By Task',
    byTaskGroup: 'By Task Group',
    totalDuration: 'Total Duration',
    sessions: 'Sessions',
    completionRate: 'Completion Rate',
    noData: 'No data available',
    statisticsPeriod: 'Statistics Period',
    startDate: 'Start Date',
    to: 'to',
    endDate: 'End Date',
    taskCount: 'Task Count',
    statisticsMethod: 'Statistics Method',
    byTaskStatistics: 'By Task Statistics',
    byTaskGroupStatistics: 'By Task Group Statistics',
    
    // Settings
    customizeTimerBackground: 'Customize timer background colors and images',
    runningBackground: 'Running Background',
    pausedBackground: 'Paused Background',
    previewEffect: 'Preview Effect',
    running: 'Running',
    paused: 'Paused',
    backgroundType: 'Background Type',
    solidColor: 'Solid Color',
    imageBackground: 'Image Background',
    selectColor: 'Select Color',
    uploadImage: 'Upload Image',
    chooseImage: 'Choose Image',
    currentImage: 'Current Image',
    resetToDefault: 'Reset to Default',
    saveConfiguration: 'Save Configuration',
    settingsSaved: 'Settings saved!',
    
    // Color Picker
    solid: 'Solid',
    gradient: 'Gradient',
    advanced: 'Advanced',
    preview: 'Preview',
    enableOpacity: 'Enable Opacity',
    opacity: 'Opacity',
    basicColors: 'Basic Colors',
    warmColors: 'Warm Colors',
    coolColors: 'Cool Colors',
    neutralColors: 'Neutral Colors',
    
    // Common
    confirm: 'Confirm',
    save: 'Save',
    add: 'Add',
    remove: 'Remove',
    close: 'Close',
    loading: 'Loading',
    error: 'Error',
    success: 'Success',
  },
};

export const getTranslation = (language: Language): Translations => {
  return translations[language];
};