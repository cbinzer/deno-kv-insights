// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use tauri::api::dialog::blocking::MessageDialogBuilder;
use tauri::api::dialog::MessageDialogKind;

fn check_deno_installed() -> bool {
    let deno_command_result = Command::new("deno1")
        .arg("--version")
        .spawn();

    return match deno_command_result {
        Ok(_) => true,
        Err(_) => false
    };
}

fn start_kv_insights() {
    Command::new("deno")
        .current_dir("../Resources/_up_")
        .arg("task")
        .arg("start")
        .spawn()
        .expect("failed");
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let deno_installed = check_deno_installed();
            if deno_installed {
                start_kv_insights();
            } else {
                let app_handle = app.handle();
                std::thread::spawn(move || {
                    MessageDialogBuilder::new("Deno not found", "Deno not found on your system. Please install the newest version of Deno.").kind(MessageDialogKind::Error).show();
                    app_handle.exit(127);
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
