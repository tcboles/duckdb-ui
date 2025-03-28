// renderer.js or in a useEffect in your component
import { ipcRenderer } from 'electron';

window.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  ipcRenderer.send('open-devtools');
});
