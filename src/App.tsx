import { useState, useEffect } from 'react';
import { Clock, BarChart3, Settings } from 'lucide-react';
import { TaskGroupManager } from './components/TaskGroupManager';
import { TaskManager } from './components/TaskManager';
import { Timer } from './components/Timer';
import { Statistics } from './components/Statistics';
import { Settings as SettingsComponent } from './components/Settings';
import { ApiService } from './services/api';
import type { TaskGroup, Task, ActiveSession, BackgroundSettings } from './types';
import { DEFAULT_BACKGROUND_SETTINGS } from './types';
import { LanguageProvider, useLanguage } from './i18n/LanguageProvider';
import './App.css';

type Tab = 'tasks' | 'timer' | 'statistics' | 'settings';

function AppMain() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [selectedGroup, setSelectedGroup] = useState<TaskGroup | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>(DEFAULT_BACKGROUND_SETTINGS);

  useEffect(() => {
    loadActiveSession();
    loadBackgroundSettings();
  }, []);

  const loadBackgroundSettings = () => {
    try {
      const saved = localStorage.getItem('timer-background-settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setBackgroundSettings({ ...DEFAULT_BACKGROUND_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load background settings:', error);
    }
  };

  const handleSettingsChange = (newSettings: BackgroundSettings) => {
    setBackgroundSettings(newSettings);
  };

  const loadActiveSession = async () => {
    try {
      console.log('Loading active session...');
      const session = await ApiService.getActiveSession();
      console.log('Active session result:', session);
      setActiveSession(session);
      console.log('Active session state updated');
    } catch (error) {
      console.error('Failed to load active session:', error);
    }
  };

  const handleSelectGroup = (group: TaskGroup) => {
    setSelectedGroup(group);
  };

  const handleStartTask = async (task: Task) => {
    console.log('Starting task:', task);
    try {
      const session = await ApiService.startSession({ task_id: task.id });
      console.log('Session started:', session);
      await loadActiveSession();
      console.log('Active session loaded, switching to timer tab');
      setActiveTab('timer');
    } catch (error) {
      console.error('Failed to start task:', error);
    }
  };

  const handleSessionEnd = async () => {
    console.log('handleSessionEnd called - clearing active session state');
    // 立即清空活跃会话状态
    setActiveSession(null);
    setActiveTab('tasks');
    // Reset pause state when session ends
    setIsPaused(false);
    setPauseStartTime(null);
    setTotalPausedTime(0);
    
    console.log('Active session cleared, reloading to confirm...');
    // 然后重新加载以确认没有活跃会话
    await loadActiveSession();
    console.log('Session end handling completed');
  };

  const handlePause = () => {
    if (isPaused) {
      // Resume timer
      setIsPaused(false);
      if (pauseStartTime) {
        const pauseDuration = Date.now() - pauseStartTime;
        setTotalPausedTime(prev => prev + pauseDuration);
        setPauseStartTime(null);
      }
    } else {
      // Pause timer
      setIsPaused(true);
      setPauseStartTime(Date.now());
    }
  };

  const handleReset = async () => {
    if (!activeSession) return;
    
    try {
      // 结束当前会话
      await ApiService.endSession({
        session_id: activeSession.session.id,
        duration_minutes: undefined,
      });
      
      // 重新开始会话
      await ApiService.startSession({ task_id: activeSession.task.id });
      
      // 重新加载活动会话
      await loadActiveSession();
      
      // 重置暂停状态
      setIsPaused(false);
      setPauseStartTime(null);
      setTotalPausedTime(0);
    } catch (error) {
      console.error('Failed to reset session:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>{t.appTitle}</h1>
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <Clock size={20} />
              {t.tasks}
            </button>
            <button
              className={`nav-tab ${activeTab === 'timer' ? 'active' : ''}`}
              onClick={() => setActiveTab('timer')}
              disabled={!activeSession}
            >
              <Clock size={20} />
              {t.timer}
              {activeSession && <span className="tab-indicator" />}
            </button>
            <button
              className={`nav-tab ${activeTab === 'statistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('statistics')}
            >
              <BarChart3 size={20} />
              {t.statistics}
            </button>
            <button
              className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              {t.settings}
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'tasks' && (
          <div className="tasks-view">
            <div className="sidebar">
              <TaskGroupManager
                onSelectGroup={handleSelectGroup}
                selectedGroupId={selectedGroup?.id}
              />
            </div>
            <div className="content">
              <TaskManager
                selectedGroup={selectedGroup}
                onStartTask={handleStartTask}
              />
            </div>
          </div>
        )}

        {activeTab === 'timer' && (
          <div 
            className={`timer-view ${isPaused ? 'bg-paused' : ''}`}
            style={{
              backgroundColor: isPaused 
                ? (backgroundSettings.paused.type === 'color' && !backgroundSettings.paused.color.startsWith('linear-gradient')
                    ? backgroundSettings.paused.color 
                    : undefined)
                : (backgroundSettings.running.type === 'color' && !backgroundSettings.running.color.startsWith('linear-gradient')
                    ? backgroundSettings.running.color 
                    : undefined),
              backgroundImage: isPaused 
                ? (backgroundSettings.paused.type === 'color' && backgroundSettings.paused.color.startsWith('linear-gradient')
                    ? backgroundSettings.paused.color 
                    : backgroundSettings.paused.type === 'image' 
                      ? `url(${backgroundSettings.paused.image})` 
                      : undefined)
                : (backgroundSettings.running.type === 'color' && backgroundSettings.running.color.startsWith('linear-gradient')
                    ? backgroundSettings.running.color 
                    : backgroundSettings.running.type === 'image' 
                      ? `url(${backgroundSettings.running.image})` 
                      : undefined),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <Timer
              activeSession={activeSession}
              onSessionEnd={handleSessionEnd}
              isPaused={isPaused}
              pauseStartTime={pauseStartTime}
              totalPausedTime={totalPausedTime}
              onPause={handlePause}
              onReset={handleReset}
            />
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="statistics-view">
            <Statistics />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-view">
            <SettingsComponent onSettingsChange={handleSettingsChange} />
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppMain />
    </LanguageProvider>
  );
}

export default App;
