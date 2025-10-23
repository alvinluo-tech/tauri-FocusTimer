use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskGroup {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub task_group_id: String,
    pub name: String,
    pub description: Option<String>,
    pub duration_minutes: Option<i32>, // None for forward timing
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskSession {
    pub id: String,
    pub task_id: String,
    pub start_time: DateTime<Utc>,
    pub end_time: Option<DateTime<Utc>>,
    pub duration_minutes: Option<i32>, // Actual duration for forward timing
    pub completed: bool,
    pub is_paused: bool,
    pub paused_at: Option<DateTime<Utc>>,
    pub total_paused_duration_ms: i64, // Total paused duration in milliseconds
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateTaskGroupRequest {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateTaskGroupRequest {
    pub name: Option<String>,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateTaskRequest {
    pub task_group_id: String,
    pub name: String,
    pub description: Option<String>,
    pub duration_minutes: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateTaskRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub duration_minutes: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StartSessionRequest {
    pub task_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EndSessionRequest {
    pub session_id: String,
    pub duration_minutes: Option<i32>, // For forward timing
}

#[allow(dead_code)]
pub struct PauseSessionRequest {
    pub session_id: String,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResumeSessionRequest {
    pub session_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StatisticsRequest {
    pub start_date: String,
    pub end_date: String,
    pub group_by: StatisticsGroupBy,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum StatisticsGroupBy {
    Task,
    TaskGroup,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskStatistics {
    pub task_id: String,
    pub task_name: String,
    pub task_group_name: String,
    pub total_sessions: i32,
    pub total_duration_minutes: i32,
    pub completed_sessions: i32,
    pub completion_rate: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskGroupStatistics {
    pub task_group_id: String,
    pub task_group_name: String,
    pub total_tasks: i32,
    pub total_sessions: i32,
    pub total_duration_minutes: i32,
    pub completed_sessions: i32,
    pub completion_rate: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StatisticsResponse {
    pub task_statistics: Vec<TaskStatistics>,
    pub task_group_statistics: Vec<TaskGroupStatistics>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActiveSession {
    pub session: TaskSession,
    pub task: Task,
    pub task_group: TaskGroup,
}