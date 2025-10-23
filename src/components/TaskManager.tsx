import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Play, Clock } from 'lucide-react';
import { ApiService } from '../services/api';
import type { Task, TaskGroup, CreateTaskRequest, UpdateTaskRequest } from '../types';
import { TIMER_PRESETS } from '../types';

interface TaskManagerProps {
  selectedGroup: TaskGroup | null;
  onStartTask: (task: Task) => void;
}

export function TaskManager({ selectedGroup, onStartTask }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: 25 as number | undefined,
    customDuration: '',
    useCustomDuration: false,
    isForwardTiming: false,
  });

  useEffect(() => {
    if (selectedGroup) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [selectedGroup]);

  const loadTasks = async () => {
    if (!selectedGroup) return;

    try {
      const data = await ApiService.getTasksByGroup(selectedGroup.id);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleCreate = async () => {
    if (!selectedGroup || !formData.name.trim()) return;

    try {
      const duration = formData.isForwardTiming 
        ? undefined 
        : (formData.useCustomDuration 
          ? parseInt(formData.customDuration) || undefined
          : formData.duration_minutes);

      const request: CreateTaskRequest = {
        task_group_id: selectedGroup.id,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        duration_minutes: duration,
      };
      const newTask = await ApiService.createTask(request);
      setTasks([newTask, ...tasks]);
      setFormData({
        name: '',
        description: '',
        duration_minutes: 25,
        customDuration: '',
        useCustomDuration: false,
        isForwardTiming: false,
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingTask || !formData.name.trim()) return;

    try {
      const duration = formData.isForwardTiming 
        ? undefined 
        : (formData.useCustomDuration 
          ? parseInt(formData.customDuration) || undefined
          : formData.duration_minutes);

      console.log('Updating task with:', {
        isForwardTiming: formData.isForwardTiming,
        useCustomDuration: formData.useCustomDuration,
        duration_minutes: formData.duration_minutes,
        customDuration: formData.customDuration,
        finalDuration: duration
      });

      const request: UpdateTaskRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        duration_minutes: duration,
      };
      const updatedTask = await ApiService.updateTask(editingTask.id, request);
      console.log('Updated task:', updatedTask);
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      setEditingTask(null);
      setFormData({
        name: '',
        description: '',
        duration_minutes: 25,
        customDuration: '',
        useCustomDuration: false,
        isForwardTiming: false,
      });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个任务吗？')) return;

    try {
      await ApiService.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const startEdit = (task: Task) => {
    console.log('Starting edit for task:', task);
    setEditingTask(task);
    const formData = {
      name: task.name,
      description: task.description || '',
      duration_minutes: task.duration_minutes || 25,
      customDuration: task.duration_minutes?.toString() || '',
      useCustomDuration: !TIMER_PRESETS.some(preset => preset.minutes === task.duration_minutes),
      isForwardTiming: task.duration_minutes === undefined,
    };
    console.log('Setting form data:', formData);
    setFormData(formData);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setIsCreating(false);
    setFormData({
      name: '',
      description: '',
      duration_minutes: 25,
      customDuration: '',
      useCustomDuration: false,
      isForwardTiming: false,
    });
  };

  if (!selectedGroup) {
    return (
      <div className="task-manager">
        <div className="empty-state">
          <Clock size={48} />
          <p>请选择一个任务组</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-manager">
      <div className="header">
        <h2>{selectedGroup.name} - 任务</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreating(true)}
          disabled={isCreating || editingTask !== null}
        >
          <Plus size={16} />
          新建任务
        </button>
      </div>

      {(isCreating || editingTask) && (
        <div className="form">
          <input
            type="text"
            placeholder="任务名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
          />
          <textarea
            placeholder="描述（可选）"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="textarea"
            rows={2}
          />
          
          <div className="duration-section">
            <label>计时方式</label>
            <div className="duration-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="durationType"
                  checked={!formData.useCustomDuration && !formData.isForwardTiming}
                  onChange={() => setFormData({ ...formData, useCustomDuration: false, isForwardTiming: false })}
                />
                预设时间
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="durationType"
                  checked={formData.useCustomDuration}
                  onChange={() => setFormData({ ...formData, useCustomDuration: true, isForwardTiming: false })}
                />
                自定义时间
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="durationType"
                  checked={formData.isForwardTiming}
                  onChange={() => setFormData({ ...formData, isForwardTiming: true, useCustomDuration: false })}
                />
                正向计时
              </label>
            </div>

            {!formData.useCustomDuration && !formData.isForwardTiming && (
              <div className="preset-buttons">
                {TIMER_PRESETS.map((preset) => (
                  <button
                    key={preset.minutes}
                    type="button"
                    className={`btn btn-sm ${formData.duration_minutes === preset.minutes ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFormData({ ...formData, duration_minutes: preset.minutes, isForwardTiming: false })}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {formData.useCustomDuration && (
              <div className="custom-duration">
                <input
                  type="number"
                  placeholder="分钟"
                  value={formData.customDuration}
                  onChange={(e) => setFormData({ ...formData, customDuration: e.target.value })}
                  className="input"
                  min="1"
                />
                <span>分钟</span>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={editingTask ? handleUpdate : handleCreate}
            >
              {editingTask ? '更新' : '创建'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={cancelEdit}
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} />
            <p>还没有任务</p>
            <p>点击上方按钮创建第一个任务</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-info">
                <h3>{task.name}</h3>
                {task.description && <p>{task.description}</p>}
                <div className="task-meta">
                  {task.duration_minutes ? (
                    <span className="duration">
                      <Clock size={14} />
                      {task.duration_minutes}分钟
                    </span>
                  ) : (
                    <span className="duration">
                      <Clock size={14} />
                      正向计时
                    </span>
                  )}
                </div>
              </div>
              <div className="task-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onStartTask(task)}
                >
                  <Play size={16} />
                  开始
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => startEdit(task)}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="btn btn-icon btn-danger"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
