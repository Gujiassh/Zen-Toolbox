// Input: Electron runtime + Vite dev server URL (default http://localhost:7001)
// Output: Frameless BrowserWindow loading renderer with preload IPC bridge
// Pos: Main process entry for Zen Toolbox desktop bootstrap (update me when folder changes)

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TextDecoder } from 'node:util';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:7001';
const RENDERER_PING_URL = `${VITE_DEV_SERVER_URL}`;

let mainWindow;

async function waitForRendererReady(maxAttempts = 20, intervalMs = 500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(RENDERER_PING_URL, { method: 'HEAD' });
      if (res.ok || res.status === 404) {
        return true;
      }
    } catch (err) {
      // ignore and retry
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#0b0b0f',
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      // Use CJS preload to avoid ESM "require() of ES Module" issues under type: module
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const ready = await waitForRendererReady();
  if (ready) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <style>
        body { background:#0b0b0f; color:#e4e4e7; font-family: sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;}
        .card { padding:20px; border:1px solid #27272a; border-radius:12px; background:#111; max-width:420px; text-align:center; }
        code { background:#000; padding:2px 4px; border-radius:4px; }
      </style>
      <div class="card">
        <h2>Renderer not ready</h2>
        <p>Vite dev server is not reachable at <code>${VITE_DEV_SERVER_URL}</code>.</p>
        <p>Please ensure <code>pnpm dev:renderer</code> is running.</p>
      </div>
    `));
  }

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:maximize-changed', true);
  });
  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:maximize-changed', false);
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window:toggle-maximize', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow?.close();
});

ipcMain.handle('seo:fetch', async (_event, targetUrl) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(targetUrl, { signal: controller.signal, redirect: 'follow' });
    const buffer = await response.arrayBuffer();
    const html = new TextDecoder().decode(buffer);
    return {
      success: true,
      statusCode: response.status,
      redirectedTo: response.url,
      html,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'unknown error',
    };
  } finally {
    clearTimeout(timeout);
  }
});
