import { app, BrowserWindow } from 'electron';
import path from 'path';

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 600,
    icon: path.join(path.dirname(new URL(import.meta.url).pathname), 'icon.png'), // Get current directory with ESM
    webPreferences: {
      nodeIntegration: true, // Optional: Enables node.js features inside renderer process
    },
  });

  // Load React app in development mode (from Vite server)
  win.loadURL('http://localhost:5173'); // Assuming you're using Vite in development mode
  win.removeMenu(); // This removes the top menu bar


  // Uncomment this in production mode:
  // win.loadFile(path.join(path.dirname(new URL(import.meta.url).pathname), 'dist', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
