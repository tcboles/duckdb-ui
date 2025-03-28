import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import { DuckDBInstance } from '@duckdb/node-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let expressProcess;
let clientProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    title: 'DuckDB',
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'persist:duckdb'
    }
  });

  win.loadURL('http://localhost:4213');
}

if (process.platform === 'darwin') {
  app.dock.setIcon(path.join(__dirname, 'assets/icon.png'));
}

let db;

async function startServers() {
  const instance = await DuckDBInstance.create();
  db = await instance.connect();
  await db.run('CALL start_ui_server();');

  // Optionally, wait a few seconds to ensure the servers are up before creating the window.
  createWindow();
}

app.whenReady().then(async () => {
  // Set the application name (macOS uses this for the app menu)
  app.setName('DuckDB');

  await startServers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('quit', async () => {
  if (db) {
    await db.run('CALL stop_ui_server();');
  }

  if (expressProcess) expressProcess.kill();
  if (clientProcess) clientProcess.kill();
});
