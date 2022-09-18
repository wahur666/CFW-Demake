#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod lib;

use tauri::Manager;
use crate::lib::initialize_systems;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] {
                let window = app.get_window("main").unwrap();
                window.open_devtools()
            }
            let mut host = false;
            match app.get_cli_matches() {
                Ok(matches) => {
                    if matches.args.contains_key("host") {
                        host = matches.args.get("host").unwrap().value.as_bool().unwrap_or(false);
                    }
                }
                Err(_) => {}
            }
            initialize_systems(host);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
