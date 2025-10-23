import { invoke } from '@tauri-apps/api/core';
import type {
  TaskGroup,
  Task,
  TaskSession,
  ActiveSession,
  CreateTaskGroupRequest,
  UpdateTaskGroupRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  StartSessionRequest,
  EndSessionRequest,
  StatisticsRequest,
  StatisticsResponse,
} from '../types';

export class ApiService {
  // Task Group operations
  static async createTaskGroup(request: CreateTaskGroupRequest): Promise<TaskGroup> {
    return await invoke('create_task_group', { request });
  }

  static async getTaskGroups(): Promise<TaskGroup[]> {
    return await invoke('get_task_groups');
  }

  static async updateTaskGroup(id: string, request: UpdateTaskGroupRequest): Promise<TaskGroup> {
    return await invoke('update_task_group', { id, request });
  }

  static async deleteTaskGroup(id: string): Promise<void> {
    return await invoke('delete_task_group', { id });
  }

  // Task operations
  static async createTask(request: CreateTaskRequest): Promise<Task> {
    return await invoke('create_task', { request });
  }

  static async getTasksByGroup(taskGroupId: string): Promise<Task[]> {
    return await invoke('get_tasks_by_group', { taskGroupId });
  }

  static async updateTask(id: string, request: UpdateTaskRequest): Promise<Task> {
    return await invoke('update_task', { id, request });
  }

  static async deleteTask(id: string): Promise<void> {
    return await invoke('delete_task', { id });
  }

  // Session operations
  static async startSession(request: StartSessionRequest): Promise<TaskSession> {
    return await invoke('start_session', { request });
  }

  static async endSession(request: EndSessionRequest): Promise<TaskSession> {
    return await invoke('end_session', { request });
  }

  static async getActiveSession(): Promise<ActiveSession | null> {
    return await invoke('get_active_session');
  }

  // Statistics operations
  static async getStatistics(request: StatisticsRequest): Promise<StatisticsResponse> {
    return await invoke('get_statistics', { request });
  }
}
