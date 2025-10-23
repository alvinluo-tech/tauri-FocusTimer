import { useState, useEffect } from 'react';
import { Calendar, BarChart3, TrendingUp, Clock } from 'lucide-react';
import { ApiService } from '../services/api';
import type { StatisticsRequest, StatisticsResponse, StatisticsPeriod } from '../types';
import { formatDuration, getDateRange, formatDate, calculateCompletionRate } from '../utils/helpers';

export function Statistics() {
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [period, setPeriod] = useState<StatisticsPeriod>('today');
  const [groupBy, setGroupBy] = useState<'Task' | 'TaskGroup'>('Task');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 如果是自定义时间范围但没有设置日期，则不加载统计数据
    if (period === 'custom' && (!customStartDate || !customEndDate)) {
      return;
    }
    loadStatistics();
  }, [period, groupBy, customStartDate, customEndDate]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      let startDate: Date;
      let endDate: Date;

      if (period === 'custom') {
        // 检查自定义日期是否有效
        if (!customStartDate || !customEndDate) {
          console.log('Custom dates not set, skipping statistics load');
          setLoading(false);
          return;
        }
        
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        
        // 检查日期是否有效
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.error('Invalid custom dates');
          setLoading(false);
          return;
        }
        
        // 设置开始时间为当天的开始，结束时间为当天的结束
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        
        startDate = start;
        endDate = end;
        
        console.log('Custom date range:', {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          localStart: startDate.toLocaleString(),
          localEnd: endDate.toLocaleString()
        });
      } else {
        const range = getDateRange(period);
        startDate = range.start;
        endDate = range.end;
      }

      const request: StatisticsRequest = {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        group_by: groupBy,
      };

      console.log('Loading statistics with request:', request);
      const data = await ApiService.getStatistics(request);
      console.log('Statistics loaded:', data);
      setStatistics(data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod: StatisticsPeriod) => {
    setPeriod(newPeriod);
    
    // 如果选择自定义时间范围，设置默认日期（今天）
    if (newPeriod === 'custom') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      setCustomStartDate(todayStr);
      setCustomEndDate(todayStr);
    }
  };

  const formatCustomDateRange = () => {
    if (!customStartDate || !customEndDate) {
      return '请选择日期范围';
    }
    
    try {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return '日期格式无效';
      }
      
      // 显示本地日期，不包含时间
      const startStr = start.toLocaleDateString('zh-CN');
      const endStr = end.toLocaleDateString('zh-CN');
      
      return `${startStr} - ${endStr}`;
    } catch (error) {
      console.error('Error formatting custom date range:', error);
      return '日期格式错误';
    }
  };

  const getPeriodLabel = (period: StatisticsPeriod): string => {
    switch (period) {
      case 'today': return '今天';
      case 'week': return '本周';
      case 'fifteen_days': return '近15天';
      case 'month': return '本月';
      case 'custom': return '自定义';
      default: return '今天';
    }
  };

  const renderTaskStatistics = () => {
    if (!statistics?.task_statistics.length) {
      return (
        <div className="empty-state">
          <BarChart3 size={48} />
          <p>暂无任务统计数据</p>
        </div>
      );
    }

    return (
      <div className="statistics-list">
        {statistics.task_statistics.map((stat) => (
          <div key={stat.task_id} className="statistics-item">
            <div className="stat-header">
              <h3>{stat.task_name}</h3>
              <span className="group-name">{stat.task_group_name}</span>
            </div>
            <div className="stat-metrics">
              <div className="metric">
                <Clock size={16} />
                <span>总时长: {formatDuration(stat.total_duration_minutes)}</span>
              </div>
              <div className="metric">
                <BarChart3 size={16} />
                <span>会话数: {stat.total_sessions}</span>
              </div>
              <div className="metric">
                <TrendingUp size={16} />
                <span>完成率: {calculateCompletionRate(stat.completed_sessions, stat.total_sessions)}%</span>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${calculateCompletionRate(stat.completed_sessions, stat.total_sessions)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTaskGroupStatistics = () => {
    if (!statistics?.task_group_statistics.length) {
      return (
        <div className="empty-state">
          <BarChart3 size={48} />
          <p>暂无任务组统计数据</p>
        </div>
      );
    }

    return (
      <div className="statistics-list">
        {statistics.task_group_statistics.map((stat) => (
          <div key={stat.task_group_id} className="statistics-item">
            <div className="stat-header">
              <h3>{stat.task_group_name}</h3>
            </div>
            <div className="stat-metrics">
              <div className="metric">
                <Clock size={16} />
                <span>总时长: {formatDuration(stat.total_duration_minutes)}</span>
              </div>
              <div className="metric">
                <BarChart3 size={16} />
                <span>任务数: {stat.total_tasks}</span>
              </div>
              <div className="metric">
                <BarChart3 size={16} />
                <span>会话数: {stat.total_sessions}</span>
              </div>
              <div className="metric">
                <TrendingUp size={16} />
                <span>完成率: {calculateCompletionRate(stat.completed_sessions, stat.total_sessions)}%</span>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${calculateCompletionRate(stat.completed_sessions, stat.total_sessions)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="statistics">
      <div className="statistics-header">
        <h2>统计报告</h2>
        
        <div className="controls">
          <div className="period-selector">
            <label>统计周期:</label>
            <select 
              value={period} 
              onChange={(e) => handlePeriodChange(e.target.value as StatisticsPeriod)}
            >
              <option value="today">今天</option>
              <option value="week">本周</option>
              <option value="fifteen_days">近15天</option>
              <option value="month">本月</option>
              <option value="custom">自定义</option>
            </select>
          </div>

          {period === 'custom' && (
            <div className="custom-date-range">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                placeholder="开始日期"
              />
              <span>至</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                placeholder="结束日期"
              />
            </div>
          )}

          <div className="group-by-selector">
            <label>统计方式:</label>
            <select 
              value={groupBy} 
              onChange={(e) => setGroupBy(e.target.value as 'Task' | 'TaskGroup')}
            >
              <option value="Task">按任务统计</option>
              <option value="TaskGroup">按任务组统计</option>
            </select>
          </div>
        </div>
      </div>

      <div className="statistics-content">
        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <p>加载中...</p>
          </div>
        ) : (
          <>
            <div className="statistics-summary">
              <div className="summary-item">
                <Calendar size={24} />
                <div>
                  <h3>{getPeriodLabel(period)}</h3>
                  <p>
                    {period === 'custom' 
                      ? formatCustomDateRange()
                      : `${formatDate(getDateRange(period).start)} - ${formatDate(getDateRange(period).end)}`
                    }
                  </p>
                </div>
              </div>
            </div>

            {groupBy === 'Task' ? renderTaskStatistics() : renderTaskGroupStatistics()}
          </>
        )}
      </div>
    </div>
  );
}
