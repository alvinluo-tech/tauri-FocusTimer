use rusqlite::{Connection, Result as SqliteResult};
use std::sync::Mutex;
use chrono::{DateTime, Utc};
use uuid::Uuid;
use crate::models::*;

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    pub fn new(database_path: &str) -> SqliteResult<Self> {
        let conn = Connection::open(database_path)?;
        let db = Database {
            conn: Mutex::new(conn),
        };
        db.init()?;
        Ok(db)
    }

    fn init(&self) -> SqliteResult<()> {
        let conn = self.conn.lock().unwrap();
        
        // Create task_groups table
        conn.execute(
            r#"
            CREATE TABLE IF NOT EXISTS task_groups (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            "#,
            [],
        )?;

        // Create tasks table
        conn.execute(
            r#"
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                task_group_id TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                duration_minutes INTEGER,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (task_group_id) REFERENCES task_groups (id) ON DELETE CASCADE
            )
            "#,
            [],
        )?;

        // Create task_sessions table
        conn.execute(
            r#"
            CREATE TABLE IF NOT EXISTS task_sessions (
                id TEXT PRIMARY KEY,
                task_id TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT,
                duration_minutes INTEGER,
                completed BOOLEAN NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
            )
            "#,
            [],
        )?;

        // Add new columns if they don't exist (migration)
        conn.execute(
            "ALTER TABLE task_sessions ADD COLUMN is_paused BOOLEAN NOT NULL DEFAULT 0",
            [],
        ).ok(); // Ignore error if column already exists
        
        conn.execute(
            "ALTER TABLE task_sessions ADD COLUMN paused_at TEXT",
            [],
        ).ok(); // Ignore error if column already exists
        
        conn.execute(
            "ALTER TABLE task_sessions ADD COLUMN total_paused_duration_ms INTEGER NOT NULL DEFAULT 0",
            [],
        ).ok(); // Ignore error if column already exists

        // 由于我们总是创建新的数据库，不需要复杂的迁移逻辑
        println!("Database initialized successfully with correct column types");

        Ok(())
    }

    // Task Group operations
    pub fn create_task_group(&self, req: CreateTaskGroupRequest) -> SqliteResult<TaskGroup> {
        let id = Uuid::new_v4().to_string();
        let now = Utc::now();
        
        let conn = self.conn.lock().unwrap();
        conn.execute(
            r#"
            INSERT INTO task_groups (id, name, description, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
            "#,
            [&id, &req.name, &req.description.as_ref().map(|s| s.as_str()).unwrap_or("").to_string(), &now.to_rfc3339(), &now.to_rfc3339()],
        )?;

        Ok(TaskGroup {
            id,
            name: req.name,
            description: req.description,
            created_at: now,
            updated_at: now,
        })
    }

    pub fn get_task_groups(&self) -> SqliteResult<Vec<TaskGroup>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, name, description, created_at, updated_at FROM task_groups ORDER BY created_at DESC"
        )?;
        
        let group_iter = stmt.query_map([], |row| {
            Ok(TaskGroup {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?)
                    .unwrap()
                    .with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(4)?)
                    .unwrap()
                    .with_timezone(&Utc),
            })
        })?;

        let mut groups = Vec::new();
        for group in group_iter {
            groups.push(group?);
        }
        Ok(groups)
    }

    pub fn update_task_group(&self, id: &str, req: UpdateTaskGroupRequest) -> SqliteResult<TaskGroup> {
        let now = Utc::now();
        
        let conn = self.conn.lock().unwrap();
        conn.execute(
            r#"
            UPDATE task_groups 
            SET name = COALESCE(?, name),
                description = COALESCE(?, description),
                updated_at = ?
            WHERE id = ?
            "#,
            [&req.name.unwrap_or_default(), &req.description.unwrap_or_default(), &now.to_rfc3339(), id],
        )?;

        // Get updated task group
        let mut stmt = conn.prepare(
            "SELECT id, name, description, created_at, updated_at FROM task_groups WHERE id = ?"
        )?;
        let group = stmt.query_row([id], |row| {
            Ok(TaskGroup {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?)
                    .unwrap()
                    .with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(4)?)
                    .unwrap()
                    .with_timezone(&Utc),
            })
        })?;

        Ok(group)
    }

    pub fn delete_task_group(&self, id: &str) -> SqliteResult<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM task_groups WHERE id = ?", [id])?;
        Ok(())
    }

    // Task operations
    pub fn create_task(&self, req: CreateTaskRequest) -> SqliteResult<Task> {
        let id = Uuid::new_v4().to_string();
        let now = Utc::now();
        
        let conn = self.conn.lock().unwrap();
        conn.execute(
            r#"
            INSERT INTO tasks (id, task_group_id, name, description, duration_minutes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            "#,
            rusqlite::params![
                id,
                req.task_group_id,
                req.name,
                req.description,
                req.duration_minutes,
                now.to_rfc3339(),
                now.to_rfc3339()
            ],
        )?;

        Ok(Task {
            id,
            task_group_id: req.task_group_id,
            name: req.name,
            description: req.description,
            duration_minutes: req.duration_minutes,
            created_at: now,
            updated_at: now,
        })
    }

    pub fn update_task(&self, id: &str, req: UpdateTaskRequest) -> SqliteResult<Task> {
        let now = Utc::now();
        
        let conn = self.conn.lock().unwrap();
        conn.execute(
            r#"
            UPDATE tasks 
            SET name = COALESCE(?, name),
                description = COALESCE(?, description),
                duration_minutes = ?,
                updated_at = ?
            WHERE id = ?
            "#,
            rusqlite::params![
                req.name,
                req.description,
                req.duration_minutes,
                now.to_rfc3339(),
                id
            ],
        )?;

        // Get updated task
        let mut stmt = conn.prepare(
            "SELECT id, task_group_id, name, description, duration_minutes, created_at, updated_at FROM tasks WHERE id = ?"
        )?;
        let task = stmt.query_row([id], |row| {
            Ok(Task {
                id: row.get(0)?,
                task_group_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                duration_minutes: row.get::<_, Option<i32>>(4)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?)
                    .unwrap()
                    .with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(6)?)
                    .unwrap()
                    .with_timezone(&Utc),
            })
        })?;

        Ok(task)
    }

    pub fn delete_task(&self, id: &str) -> SqliteResult<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM tasks WHERE id = ?", [id])?;
        Ok(())
    }

    // Session operations
    pub fn start_session(&self, req: StartSessionRequest) -> SqliteResult<TaskSession> {
        let id = Uuid::new_v4().to_string();
        let now = Utc::now();
        
        println!("Starting session for task: {}", req.task_id);
        
        let conn = self.conn.lock().unwrap();
        conn.execute(
            r#"
            INSERT INTO task_sessions (id, task_id, start_time, completed, is_paused, total_paused_duration_ms, created_at)
            VALUES (?, ?, ?, 0, 0, 0, ?)
            "#,
            [&id, &req.task_id, &now.to_rfc3339(), &now.to_rfc3339()],
        )?;

        println!("Session created with ID: {}", id);

        Ok(TaskSession {
            id,
            task_id: req.task_id,
            start_time: now,
            end_time: None,
            duration_minutes: None,
            completed: false,
            is_paused: false,
            paused_at: None,
            total_paused_duration_ms: 0,
            created_at: now,
        })
    }

    pub fn end_session(&self, req: EndSessionRequest) -> SqliteResult<TaskSession> {
        let now = Utc::now();
        
        let conn = self.conn.lock().unwrap();
        conn.execute(
            r#"
            UPDATE task_sessions 
            SET end_time = ?, duration_minutes = ?, completed = 1
            WHERE id = ?
            "#,
            rusqlite::params![
                now.to_rfc3339(),
                req.duration_minutes,
                req.session_id
            ],
        )?;

        // Get updated session
        let mut stmt = conn.prepare(
            "SELECT id, task_id, start_time, end_time, duration_minutes, completed, is_paused, paused_at, total_paused_duration_ms, created_at FROM task_sessions WHERE id = ?"
        )?;
        let session = stmt.query_row([&req.session_id], |row| {
            Ok(TaskSession {
                id: row.get(0)?,
                task_id: row.get(1)?,
                start_time: DateTime::parse_from_rfc3339(&row.get::<_, String>(2)?)
                    .unwrap()
                    .with_timezone(&Utc),
                end_time: row.get::<_, Option<String>>(3)?
                    .map(|s| DateTime::parse_from_rfc3339(&s).unwrap().with_timezone(&Utc)),
                duration_minutes: row.get(4)?,
                completed: row.get(5)?,
                is_paused: row.get(6)?,
                paused_at: row.get::<_, Option<String>>(7)?
                    .map(|s| DateTime::parse_from_rfc3339(&s).unwrap().with_timezone(&Utc)),
                total_paused_duration_ms: row.get(8)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?)
                    .unwrap()
                    .with_timezone(&Utc),
            })
        })?;

        Ok(session)
    }

    pub fn get_active_session(&self) -> SqliteResult<Option<ActiveSession>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            r#"
            SELECT 
                s.id as session_id,
                s.task_id,
                s.start_time,
                s.end_time,
                s.duration_minutes,
                s.completed,
                s.is_paused,
                s.paused_at,
                s.total_paused_duration_ms,
                s.created_at as session_created_at,
                t.id as task_id_2,
                t.task_group_id,
                t.name as task_name,
                t.description as task_description,
                t.duration_minutes as task_duration_minutes,
                t.created_at as task_created_at,
                t.updated_at as task_updated_at,
                tg.id as group_id,
                tg.name as group_name,
                tg.description as group_description,
                tg.created_at as group_created_at,
                tg.updated_at as group_updated_at
            FROM task_sessions s
            JOIN tasks t ON s.task_id = t.id
            JOIN task_groups tg ON t.task_group_id = tg.id
            WHERE s.end_time IS NULL
            ORDER BY s.start_time DESC
            LIMIT 1
            "#
        )?;

        let result = stmt.query_row([], |row| {
            Ok(ActiveSession {
                session: TaskSession {
                    id: row.get(0)?,
                    task_id: row.get(1)?,
                    start_time: DateTime::parse_from_rfc3339(&row.get::<_, String>(2)?)
                        .unwrap()
                        .with_timezone(&Utc),
                    end_time: row.get::<_, Option<String>>(3)?
                        .map(|s| DateTime::parse_from_rfc3339(&s).unwrap().with_timezone(&Utc)),
                    duration_minutes: row.get(4)?,
                    completed: row.get(5)?,
                    is_paused: row.get(6)?,
                    paused_at: row.get::<_, Option<String>>(7)?
                        .map(|s| DateTime::parse_from_rfc3339(&s).unwrap().with_timezone(&Utc)),
                    total_paused_duration_ms: row.get(8)?,
                    created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?)
                        .unwrap()
                        .with_timezone(&Utc),
                },
                task: Task {
                    id: row.get(10)?, // t.id as task_id_2
                    task_group_id: row.get(11)?,
                    name: row.get(12)?,
                    description: row.get(13)?,
                    duration_minutes: row.get(14)?,
                    created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(15)?)
                        .unwrap()
                        .with_timezone(&Utc),
                    updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(16)?)
                        .unwrap()
                        .with_timezone(&Utc),
                },
                task_group: TaskGroup {
                    id: row.get(17)?,
                    name: row.get(18)?,
                    description: row.get(19)?,
                    created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(20)?)
                        .unwrap()
                        .with_timezone(&Utc),
                    updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(21)?)
                        .unwrap()
                        .with_timezone(&Utc),
                },
            })
        });

        match result {
            Ok(session) => {
                println!("Found active session: {}", session.session.id);
                Ok(Some(session))
            },
            Err(rusqlite::Error::QueryReturnedNoRows) => {
                println!("No active session found");
                Ok(None)
            },
            Err(e) => Err(e),
        }
    }

    // Statistics operations
    pub fn get_statistics(&self, req: StatisticsRequest) -> SqliteResult<StatisticsResponse> {
        // 直接使用字符串格式的日期，不需要转换
        let start_date = &req.start_date;
        let end_date = &req.end_date;
        
        println!("Getting statistics for date range: {} to {}", start_date, end_date);
        
        // Get task statistics
        let conn = self.conn.lock().unwrap();
        
        // 添加一些调试信息来检查数据库中的实际数据
        let mut debug_stmt = conn.prepare("SELECT COUNT(*) as total_sessions FROM task_sessions WHERE end_time IS NOT NULL")?;
        let total_sessions: i32 = debug_stmt.query_row([], |row| row.get(0))?;
        println!("Total completed sessions in database: {}", total_sessions);
        
        let mut debug_stmt2 = conn.prepare("SELECT COUNT(*) as sessions_in_range FROM task_sessions WHERE end_time IS NOT NULL AND start_time >= ? AND start_time <= ?")?;
        let sessions_in_range: i32 = debug_stmt2.query_row([start_date, end_date], |row| row.get(0))?;
        println!("Sessions in date range: {}", sessions_in_range);
        let mut stmt = conn.prepare(
            r#"
            SELECT 
                t.id as task_id,
                t.name as task_name,
                tg.name as task_group_name,
                COUNT(s.id) as total_sessions,
                COALESCE(SUM(s.duration_minutes), 0) as total_duration_minutes,
                COUNT(CASE WHEN s.completed = 1 THEN 1 END) as completed_sessions
            FROM tasks t
            JOIN task_groups tg ON t.task_group_id = tg.id
            LEFT JOIN task_sessions s ON t.id = s.task_id 
                AND s.start_time >= ? AND s.start_time <= ?
            GROUP BY t.id, t.name, tg.name
            ORDER BY total_duration_minutes DESC
            "#
        )?;

        let task_iter = stmt.query_map([start_date, end_date], |row| {
            let total_sessions: i32 = row.get(3)?;
            let completed_sessions: i32 = row.get(5)?;
            let completion_rate = if total_sessions > 0 {
                completed_sessions as f64 / total_sessions as f64
            } else {
                0.0
            };

            Ok(TaskStatistics {
                task_id: row.get(0)?,
                task_name: row.get(1)?,
                task_group_name: row.get(2)?,
                total_sessions,
                total_duration_minutes: row.get(4)?,
                completed_sessions,
                completion_rate,
            })
        })?;

        let mut task_statistics = Vec::new();
        for stat in task_iter {
            task_statistics.push(stat?);
        }

        // Get task group statistics
        let mut stmt = conn.prepare(
            r#"
            SELECT 
                tg.id as task_group_id,
                tg.name as task_group_name,
                COUNT(DISTINCT t.id) as total_tasks,
                COUNT(s.id) as total_sessions,
                COALESCE(SUM(s.duration_minutes), 0) as total_duration_minutes,
                COUNT(CASE WHEN s.completed = 1 THEN 1 END) as completed_sessions
            FROM task_groups tg
            LEFT JOIN tasks t ON tg.id = t.task_group_id
            LEFT JOIN task_sessions s ON t.id = s.task_id 
                AND s.start_time >= ? AND s.start_time <= ?
            GROUP BY tg.id, tg.name
            ORDER BY total_duration_minutes DESC
            "#
        )?;

        let group_iter = stmt.query_map([start_date, end_date], |row| {
            let total_sessions: i32 = row.get(3)?;
            let completed_sessions: i32 = row.get(5)?;
            let completion_rate = if total_sessions > 0 {
                completed_sessions as f64 / total_sessions as f64
            } else {
                0.0
            };

            Ok(TaskGroupStatistics {
                task_group_id: row.get(0)?,
                task_group_name: row.get(1)?,
                total_tasks: row.get(2)?,
                total_sessions,
                total_duration_minutes: row.get(4)?,
                completed_sessions,
                completion_rate,
            })
        })?;

        let mut task_group_statistics = Vec::new();
        for stat in group_iter {
            task_group_statistics.push(stat?);
        }

        Ok(StatisticsResponse {
            task_statistics,
            task_group_statistics,
        })
    }

    pub fn get_tasks_by_group(&self, task_group_id: &str) -> SqliteResult<Vec<Task>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, task_group_id, name, description, duration_minutes, created_at, updated_at FROM tasks WHERE task_group_id = ? ORDER BY created_at DESC"
        )?;
        
        let task_iter = stmt.query_map([task_group_id], |row| {
            Ok(Task {
                id: row.get(0)?,
                task_group_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                duration_minutes: row.get::<_, Option<i32>>(4)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?)
                    .unwrap()
                    .with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(6)?)
                    .unwrap()
                    .with_timezone(&Utc),
            })
        })?;
    
        let mut tasks = Vec::new();
        for task in task_iter {
            tasks.push(task?);
        }
        Ok(tasks)
    }
}
