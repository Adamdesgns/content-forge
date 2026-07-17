const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs/promises');

const DATA_FILE = 'content-forge-data.json';
const ALLOWED_PROMPTS = new Set([
  'CAROUSEL-FORGE-v1.md',
  'editorial-os-instagram-carousel-prompt.md',
  'NEON-LISTICLE-CAROUSEL-v1.md',
  'TIKTOK-REEL-FORGE-v1.md',
  'ARTICLE-IMAGE-5x2-v1.md'
]);

function getDataPath() {
  return path.join(app.getPath('userData'), DATA_FILE);
}

async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function writeJsonFile(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1040,
    minHeight: 700,
    title: 'Lucedale Content Forge',
    backgroundColor: '#000000',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    titleBarOverlay: process.platform === 'darwin' ? undefined : {
      color: '#00000000',
      symbolColor: '#f5f5f7',
      height: 56
    },
    trafficLightPosition: { x: 18, y: 20 },
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  return win;
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Start a New Project',
          accelerator: 'CmdOrCtrl+N',
          click: (_item, win) => win?.webContents.send('menu:new-project')
        },
        { type: 'separator' },
        {
          label: 'Save App Data',
          accelerator: 'CmdOrCtrl+S',
          click: (_item, win) => win?.webContents.send('menu:save')
        },
        {
          label: 'Export App Data',
          accelerator: 'CmdOrCtrl+E',
          click: (_item, win) => win?.webContents.send('menu:export')
        },
        {
          label: 'Import App Data',
          accelerator: 'CmdOrCtrl+I',
          click: (_item, win) => win?.webContents.send('menu:import')
        },
        { type: 'separator' },
        {
          label: 'Open Data Folder',
          click: async () => {
            await fs.mkdir(app.getPath('userData'), { recursive: true });
            await shell.openPath(app.getPath('userData'));
          }
        },
        { type: 'separator' },
        { role: process.platform === 'darwin' ? 'close' : 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  createMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('app:data-path', () => getDataPath());

ipcMain.handle('app:load-data', async () => {
  try {
    return await readJsonFile(getDataPath());
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
});

ipcMain.handle('app:save-data', async (_event, data) => {
  await writeJsonFile(getDataPath(), data);
  return { ok: true, path: getDataPath() };
});

ipcMain.handle('app:export-data', async (_event, data) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Export Content Forge Data',
    defaultPath: 'content-forge-export.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (canceled || !filePath) return { canceled: true };
  await writeJsonFile(filePath, data);
  return { ok: true, path: filePath };
});

ipcMain.handle('app:import-data', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Import Content Forge Data',
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (canceled || !filePaths?.[0]) return { canceled: true };
  const data = await readJsonFile(filePaths[0]);
  await writeJsonFile(getDataPath(), data);
  return { ok: true, path: filePaths[0], data };
});

ipcMain.handle('app:read-prompt', async (_event, filename) => {
  if (!ALLOWED_PROMPTS.has(filename)) {
    throw new Error('Prompt file is not allowed.');
  }
  return fs.readFile(path.join(__dirname, 'prompts', filename), 'utf8');
});
