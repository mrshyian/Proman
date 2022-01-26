import { boardsManager } from "./controller/boardsManager.js";
import {initRenameModal} from "./controller/modalManager.js";


function init() {
  boardsManager.loadBoards();
  initRenameModal();
}

init();
