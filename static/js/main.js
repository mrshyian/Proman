import { boardsManager } from "./controller/boardsManager.js";
import {initRenameCardModal, initRenameModal, initRenameColumnModal} from "./controller/modalManager.js";


function init() {
  boardsManager.loadBoards();
  initRenameModal();
  initRenameCardModal();
  initRenameColumnModal();
}

init();
