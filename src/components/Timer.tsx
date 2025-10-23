import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { ApiService } from '../services/api';
import type { ActiveSession, EndSessionRequest } from '../types';
import { formatTime } from '../utils/helpers';

interface TimerProps {
  activeSession: ActiveSession | null;
  onSessionEnd: () => void;
  isPaused: boolean;
  pauseStartTime: number | null;
  totalPausedTime: number;
  onPause: () => void;
  onReset: () => void;
}

export function Timer({ 
  activeSession, 
  onSessionEnd, 
  isPaused, 
  pauseStartTime, 
  totalPausedTime, 
  onPause, 
  onReset 
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeSession) {
      const task = activeSession.task;
      
      // 立即计算当前真实时间，避免闪烁
      const now = Date.now();
      const sessionStartTime = new Date(activeSession.session.start_time).getTime();
      const currentPauseTime = pauseStartTime ? now - pauseStartTime : 0;
      const actualElapsed = Math.floor((now - sessionStartTime - totalPausedTime - currentPauseTime) / 1000);
      
      if (task.duration_minutes != null) {
        // Countdown timer
        const remaining = Math.max(0, task.duration_minutes * 60 - actualElapsed);
        setTimeLeft(remaining);
        setElapsedTime(actualElapsed);
      } else {
        // Forward timer
        setTimeLeft(0); // 正向计时不需要倒计时
        setElapsedTime(actualElapsed);
        console.log('Forward timer initialized:', {
          actualElapsed,
          sessionStartTime: new Date(sessionStartTime).toLocaleString(),
          now: new Date(now).toLocaleString(),
          totalPausedTime,
          currentPauseTime
        });
      }
      
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setTimeLeft(0);
      setElapsedTime(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [activeSession, pauseStartTime, totalPausedTime]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const sessionStartTime = new Date(activeSession!.session.start_time).getTime();
        // 计算当前暂停时间（如果正在暂停）
        const currentPauseTime = pauseStartTime ? now - pauseStartTime : 0;
        // 实际经过的时间 = 当前时间 - 开始时间 - 总暂停时间 - 当前暂停时间
        const actualElapsed = Math.floor((now - sessionStartTime - totalPausedTime - currentPauseTime) / 1000);
        
        if (activeSession!.task.duration_minutes != null) {
          // Countdown timer
          const remaining = Math.max(0, activeSession!.task.duration_minutes * 60 - actualElapsed);
          setTimeLeft(remaining);
          setElapsedTime(actualElapsed);
          
          if (remaining === 0) {
            handleComplete();
          }
        } else {
          // Forward timer
          setTimeLeft(0); // 正向计时不需要倒计时
          setElapsedTime(actualElapsed);
          console.log('Forward timer update:', {
            actualElapsed,
            sessionStartTime: new Date(sessionStartTime).toLocaleString(),
            now: new Date(now).toLocaleString(),
            totalPausedTime,
            currentPauseTime
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, activeSession, pauseStartTime, totalPausedTime]);

  const handlePause = () => {
    onPause();
  };

  const handleStop = async () => {
    if (!activeSession) return;

    console.log('Stopping session:', activeSession.session.id);
    console.log('Elapsed time (seconds):', elapsedTime);
    console.log('Task type:', activeSession.task.duration_minutes != null ? 'Countdown' : 'Forward');

    try {
      let duration: number | undefined;
      
      if (activeSession.task.duration_minutes != null) {
        // 倒计时任务：记录实际经过的时间
        duration = Math.floor(elapsedTime / 60);
        console.log('Countdown task - recording actual elapsed time:', duration, 'minutes');
      } else {
        // 正向计时任务：记录实际经过的时间
        duration = Math.floor(elapsedTime / 60);
        console.log('Forward task - recording actual elapsed time:', duration, 'minutes');
      }

      const request: EndSessionRequest = {
        session_id: activeSession.session.id,
        duration_minutes: duration > 0 ? duration : 1, // 至少记录1分钟
      };

      console.log('Ending session with request:', request);
      await ApiService.endSession(request);
      console.log('Session ended successfully - time recorded in statistics');
      console.log('Calling onSessionEnd to clear active session state');
      onSessionEnd();
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const handleComplete = async () => {
    if (!activeSession) return;

    console.log('Completing session:', activeSession.session.id);
    console.log('Elapsed time (seconds):', elapsedTime);
    console.log('Task type:', activeSession.task.duration_minutes != null ? 'Countdown' : 'Forward');

    try {
      let duration: number;
      
      if (activeSession.task.duration_minutes != null) {
        // 倒计时任务：记录预设的完整时间
        duration = activeSession.task.duration_minutes;
        console.log('Countdown task - recording full duration:', duration, 'minutes');
      } else {
        // 正向计时任务：记录实际经过的时间
        duration = Math.floor(elapsedTime / 60);
        console.log('Forward task - recording actual elapsed time:', duration, 'minutes');
      }

      const request: EndSessionRequest = {
        session_id: activeSession.session.id,
        duration_minutes: duration > 0 ? duration : 1, // 至少记录1分钟
      };

      console.log('Completing session with request:', request);
      await ApiService.endSession(request);
      console.log('Session completed successfully - time recorded in statistics');
      console.log('Calling onSessionEnd to clear active session state');
      onSessionEnd();
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  };

  const handleReset = () => {
    // 重置功能现在由父组件处理
    onReset();
  };

  if (!activeSession) {
    console.log('Timer: No active session, showing placeholder');
    return (
      <div className="timer">
        <div className="timer-display">
          <div className="timer-time">00:00</div>
          <div className="timer-label">选择任务开始计时</div>
        </div>
      </div>
    );
  }

  const isCountdown = activeSession.task.duration_minutes != null;
  const displayTime = isCountdown ? timeLeft : elapsedTime;
  const progress = isCountdown && activeSession.task.duration_minutes 
    ? ((activeSession.task.duration_minutes * 60 - timeLeft) / (activeSession.task.duration_minutes * 60)) * 100 
    : 0;

  // 调试信息
  console.log('Timer render state:', {
    isCountdown,
    displayTime,
    elapsedTime,
    timeLeft,
    isRunning,
    isPaused,
    taskDuration: activeSession.task.duration_minutes
  });

  return (
    <div className="timer">
      <div className="timer-header">
        <h3>{activeSession.task.name}</h3>
        <p className="task-group">{activeSession.task_group.name}</p>
      </div>

      <div className="timer-display">
        <div className="timer-time">{formatTime(displayTime)}</div>
        <div className="timer-label">
          {isCountdown ? '倒计时' : '正向计时'}
        </div>
        
        {isCountdown && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="timer-controls">
        <button
          className="btn btn-secondary"
          onClick={handlePause}
          disabled={!isRunning}
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
          {isPaused ? '继续' : '暂停'}
        </button>
        
        <button
          className="btn btn-danger"
          onClick={handleStop}
          disabled={!isRunning}
        >
          <Square size={20} />
          停止
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={!isRunning}
        >
          <RotateCcw size={20} />
          重置
        </button>
      </div>

      {isCountdown && timeLeft === 0 && (
        <div className="timer-complete">
          <h2>时间到！</h2>
          <p>任务已完成</p>
        </div>
      )}
    </div>
  );
}
