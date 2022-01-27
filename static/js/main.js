import { boardsManager } from "./controller/boardsManager.js";
import {initRenameCardModal, initRenameModal} from "./controller/modalManager.js";


function init() {
  boardsManager.loadBoards();
  initRenameModal();
  initRenameCardModal();
}

init();
