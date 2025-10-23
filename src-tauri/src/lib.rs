use std::sync::Arc;
use tauri::{State, Manager};
use std::sync::Mutex;

mod models;
mod database;

use models::*;
use database::Database;

type DbState = Arc<Mutex<Database>>;

// Task Group Commands
#[tauri::command]
fn create_task_group(
    db: State<'_, DbState>,
    request: CreateTaskGroupRequest,
) -> Result<TaskGroup, String> {
    let db = db.lock().unwrap();
    db.create_task_group(request)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_task_groups(db: State<'_, DbState>) -> Result<Vec<TaskGroup>, String> {
    let db = db.lock().unwrap();
    db.get_task_groups()
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn update_task_group(
    db: State<'_, DbState>,
    id: String,
    request: UpdateTaskGroupRequest,
) -> Result<TaskGroup, String> {
    let db = db.lock().unwrap();
    db.update_task_group(&id, request)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_task_group(db: State<'_, DbState>, id: String) -> Result<(), String> {
    let db = db.lock().unwrap();
    db.delete_task_group(&id)
        .map_err(|e| e.to_string())
}

// Task Commands
#[tauri::command]
fn create_task(
    db: State<'_, DbState>,
    request: CreateTaskRequest,
) -> Result<Task, String> {
    let db = db.lock().unwrap();
    db.create_task(request)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_tasks_by_group(
    db: State<'_, DbState>,
    task_group_id: String,
) -> Result<Vec<Task>, String> {
    let db = db.lock().unwrap();
    db.get_tasks_by_group(&task_group_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn update_task(
    db: State<'_, DbState>,
    id: String,
    request: UpdateTaskRequest,
) -> Result<Task, String> {
    let db = db.lock().unwrap();
    db.update_task(&id, request)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_task(db: State<'_, DbState>, id: String) -> Result<(), String> {
    let db = db.lock().unwrap();
    db.delete_task(&id)
        .map_err(|e| e.to_string())
}

// Session Commands
#[tauri::command]
fn start_session(
    db: State<'_, DbState>,
    request: StartSessionRequest,
) -> Result<TaskSession, String> {
    let db = db.lock().unwrap();
    db.start_session(request)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn end_session(
    db: State<'_, DbState>,
    request: EndSessionRequest,
) -> Result<TaskSession, String> {
    let db = db.lock().unwrap();
    db.end_session(request)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_active_session(db: State<'_, DbState>) -> Result<Option<ActiveSession>, String> {
    let db = db.lock().unwrap();
    db.get_active_session()
        .map_err(|e| e.to_string())
}

// Statistics Commands
#[tauri::command]
fn get_statistics(
    db: State<'_, DbState>,
    request: StatisticsRequest,
) -> Result<StatisticsResponse, String> {
    let db = db.lock().unwrap();
    db.get_statistics(request)
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .setup(|app| {
            let handle = app.handle();
            
            // Initialize database
            let app_data_dir = handle
                .path()
                .app_data_dir()
                .expect("无法获取应用数据目录");
            
            // Create app data directory if it doesn't exist
            std::fs::create_dir_all(&app_data_dir).expect("Failed to create app data directory");
            
            let database_path = app_data_dir.join("todolist.db");
            
            println!("App data dir: {:?}", app_data_dir);
            println!("Database path: {:?}", database_path);
            println!("Database file exists: {}", database_path.exists());
            println!("Parent dir exists: {}", database_path.parent().unwrap().exists());
            
            // 数据库文件会自然创建，不需要特殊处理
            println!("Database will be created/opened at: {:?}", database_path);
            
            let db = Database::new(&database_path.to_string_lossy())
                .expect("Failed to initialize database");
            let db_state: DbState = Arc::new(Mutex::new(db));
            
            app.manage(db_state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_task_group,
            get_task_groups,
            update_task_group,
            delete_task_group,
            create_task,
            get_tasks_by_group,
            update_task,
            delete_task,
            start_session,
            end_session,
            get_active_session,
            get_statistics
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}