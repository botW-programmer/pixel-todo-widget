const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

// We declare these variables up here so they don't accidentally get deleted by the system's memory manager
let win = null;
let tray = null;

function createWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    transparent: true,
    resizable: false,
    
    /* hides the app from main taskbar */
    skipTaskbar: true, 
    
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  /* NEW: If you try to close the window (like with Alt+F4), this catches it 
     and just hides the widget instead of completely killing the app */
  win.on('close', function (event) {
    if (!app.isQuitting) {
      event.preventDefault();
      win.hide();
    }
    return false;
  });
}

app.whenReady().then(() => {
  createWindow();

  /* --- SYSTEM TRAY SETUP --- */
  
  // tells electron where icon is
  tray = new Tray(path.join(__dirname, 'icon.png')); 
  
  // 2. Create the right-click menu for the tray icon
  const contextMenu = Menu.buildFromTemplate([
    { label: 'show', click: () => win.show() },
    { label: 'hide', click: () => win.hide() },
    { type: 'separator' }, // Adds a visual dividing line
    { label: 'Quit completely', click: () => {
        app.isQuitting = true; // Tells the app it's actually allowed to close now
        app.quit();
      } 
    }
  ]);
  
  tray.setToolTip('my quests');
  tray.setContextMenu(contextMenu);
  
  // 3. Make it so simply left-clicking the tray icon toggles the widget on and off
  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });

  /* --- RUN ON STARTUP --- */
  // This tells your computer to quietly launch this app in the background when you turn it on
  app.setLoginItemSettings({
    openAtLogin: true
  });
});