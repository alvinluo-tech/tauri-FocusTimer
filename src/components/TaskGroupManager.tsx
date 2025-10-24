import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { ApiService } from '../services/api';
import type { TaskGroup, CreateTaskGroupRequest, UpdateTaskGroupRequest } from '../types';

interface TaskGroupManagerProps {
  onSelectGroup: (group: TaskGroup) => void;
  selectedGroupId?: string;
}

export function TaskGroupManager({ onSelectGroup, selectedGroupId }: TaskGroupManagerProps) {
  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TaskGroup | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await ApiService.getTaskGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load task groups:', error);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    try {
      const request: CreateTaskGroupRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };
      const newGroup = await ApiService.createTaskGroup(request);
      setGroups([newGroup, ...groups]);
      setFormData({ name: '', description: '' });
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create task group:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingGroup || !formData.name.trim()) return;

    try {
      const request: UpdateTaskGroupRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };
      const updatedGroup = await ApiService.updateTaskGroup(editingGroup.id, request);
      setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
      setEditingGroup(null);
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Failed to update task group:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个任务组吗？这将删除组内的所有任务。')) return;

    try {
      await ApiService.deleteTaskGroup(id);
      setGroups(groups.filter(g => g.id !== id));
      if (selectedGroupId === id) {
        onSelectGroup(groups[0]);
      }
    } catch (error) {
      console.error('Failed to delete task group:', error);
    }
  };

  const startEdit = (group: TaskGroup) => {
    setEditingGroup(group);
    setFormData({ name: group.name, description: group.description || '' });
  };

  const cancelEdit = () => {
    setEditingGroup(null);
    setIsCreating(false);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="task-group-manager">
      <div className="header">
        <h2>任务组</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreating(true)}
          disabled={isCreating || editingGroup !== null}
        >
          <Plus size={16} />
          新建任务组
        </button>
      </div>

      {(isCreating || editingGroup) && (
        <div className="form">
          <input
            type="text"
            placeholder="任务组名称"
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
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={editingGroup ? handleUpdate : handleCreate}
            >
              {editingGroup ? '更新' : '创建'}
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

      <div className="groups-list">
        {groups.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={48} />
            <p>还没有任务组</p>
            <p>点击上方按钮创建第一个任务组</p>
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className={`group-item ${selectedGroupId === group.id ? 'selected' : ''}`}
              onClick={() => onSelectGroup(group)}
            >
              <div className="group-info">
                <h3>{group.name}</h3>
                {group.description && <p>{group.description}</p>}
              </div>
              <div className="group-actions">
                <button
                  className="btn btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(group);
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="btn btn-icon btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(group.id);
                  }}
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
