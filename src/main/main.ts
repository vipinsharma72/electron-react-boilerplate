/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import path from 'path';
import { createServer } from 'net';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { networkInterfaces, NetworkInterfaceInfo } from 'os';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

// import { json } from 'node:stream/consumers';
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// ipcMain.handle('get-ip-address', async () => {
//   return getIPAddress();
// });

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Create TCP server here
 */
let lastDataReceived = Date.now();
let disconnected = false;
setInterval(() => {
  if (!disconnected && Date.now() - lastDataReceived > 20000) {
    console.log(
      'No data received for 20 seconds, triggering deviceDisconnected...',
    );
    mainWindow?.webContents.send('deviceDisconnected', true);
    disconnected = true;
  }
}, 2000);

function handleConnection(conn: any) {
  const remoteAddress = `${conn.remoteAddress}:${conn.remotePort}`;
  console.log('new client connection from %s', remoteAddress);
  function onConnClose() {
    console.log('connection from %s closed', remoteAddress);
  }
  function onConnError(err: any) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
  function onConnData(d: any) {
    lastDataReceived = Date.now();
    disconnected = false;
    console.log('connection data from %s: %s', remoteAddress, d);
    // const jsonData = JSON.parse(d);

    // mainWindow?.webContents.send('jsonData', jsonData);
    mainWindow?.webContents.send('jsonData', d);
    // push data to ipc
    conn.write(d);
  }
  conn.on('data', onConnData);
  conn.once('close', onConnClose);
  conn.on('error', onConnError);
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function getIPAddress(): string {
  const interfaces = networkInterfaces();
  let ipAddress = '';

  for (const [, ifaceArray] of Object.entries(interfaces)) {
    const ifaceList = ifaceArray as NetworkInterfaceInfo[];

    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // mainWindow?.webContents.send('ipAddress', iface.address);
        // return iface.address;
        ipAddress = iface.address;
        break;
      }
    }
  }

  const port = 31; // server.address().port;
  const data = {
    ipAddress,
    port,
  };

  mainWindow?.webContents.send('ipPortData', data);
  return ipAddress;
  // return '';
}
app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
      // console.log(getIPAddress());
    });
  })
  .catch(console.log);

// const ip = getIPAddress();
// console.log(getIPAddress());

let initFlag = false;

setInterval(() => {
  // const ip = getIPAddress();

  if (initFlag === false) {
    const server = createServer();
    server.on('connection', handleConnection);
    // server.listen(31, '192.168.0.2', () => {
    server.listen(31, getIPAddress(), () => {
      console.log('server listening to %j', server.address());
    });
  }
  initFlag = true;
}, 3000);

// mainWindow?.webContents.send('ipAddress', ip);

// console.log('ipaddress', getIPAddress());

// const ipAddress = getIPAddress();
