export interface TaskGroup {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  task_group_id: string;
  name: string;
  description?: string;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface TaskSession {
  id: string;
  task_id: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  completed: boolean;
  created_at: string;
}

export interface ActiveSession {
  session: TaskSession;
  task: Task;
  task_group: TaskGroup;
}

export interface CreateTaskGroupRequest {
  name: string;
  description?: string;
}

export interface UpdateTaskGroupRequest {
  name?: string;
  description?: string;
}

export interface CreateTaskRequest {
  task_group_id: string;
  name: string;
  description?: string;
  duration_minutes?: number;
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  duration_minutes?: number;
}

export interface StartSessionRequest {
  task_id: string;
}

export interface EndSessionRequest {
  session_id: string;
  duration_minutes?: number;
}

export interface StatisticsRequest {
  start_date: string;
  end_date: string;
  group_by: 'Task' | 'TaskGroup';
}

export interface TaskStatistics {
  task_id: string;
  task_name: string;
  task_group_name: string;
  total_sessions: number;
  total_duration_minutes: number;
  completed_sessions: number;
  completion_rate: number;
}

export interface TaskGroupStatistics {
  task_group_id: string;
  task_group_name: string;
  total_tasks: number;
  total_sessions: number;
  total_duration_minutes: number;
  completed_sessions: number;
  completion_rate: number;
}

export interface StatisticsResponse {
  task_statistics: TaskStatistics[];
  task_group_statistics: TaskGroupStatistics[];
}

export type TimerMode = 'countdown' | 'forward';

export interface TimerPreset {
  label: string;
  minutes: number;
}

export const TIMER_PRESETS: TimerPreset[] = [
  { label: '25分钟', minutes: 25 },
  { label: '30分钟', minutes: 30 },
  { label: '45分钟', minutes: 45 },
  { label: '1小时', minutes: 60 },
];

export type StatisticsPeriod = 'today' | 'week' | 'fifteen_days' | 'month' | 'custom';

// 设置相关类型
export interface BackgroundSettings {
  running: {
    type: 'color' | 'image';
    color: string;
    image: string | null;
  };
  paused: {
    type: 'color' | 'image';
    color: string;
    image: string | null;
  };
}

export const DEFAULT_BACKGROUND_SETTINGS: BackgroundSettings = {
  running: {
    type: 'color',
    color: '#7c3aed', // 紫色
    image: null,
  },
  paused: {
    type: 'color',
    color: '#eab308', // 黄色
    image: null,
  },
};