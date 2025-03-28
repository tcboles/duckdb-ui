import { DuckDBInstance } from '@duckdb/node-api';
import { app, BrowserWindow } from 'electron';
import electronUpdater from 'electron-updater';
import path from 'path';
import { fileURLToPath } from 'url';

const { autoUpdater } = electronUpdater;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    title: `DuckDB (Unofficial)`,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'persist:duckdb'
    }
  });

  win.loadURL('http://localhost:4213');

  // Trigger update check
  autoUpdater.checkForUpdatesAndNotify();
}

autoUpdater.on('update-downloaded', () => {
  const choice = dialog.showMessageBoxSync({
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Update Ready',
    message: 'A new version has been downloaded. Restart now?'
  });

  if (choice === 0) {
    autoUpdater.quitAndInstall();
  }
});

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
  app.setName('DuckDB (Unofficial)');

  await startServers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('quit', async () => {
  db?.close?.();
});
