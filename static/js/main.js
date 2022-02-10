import { boardsManager, refresh_after_click } from "./controller/boardsManager.js";
import {initRenameCardModal, initRenameModal, initRenameColumnModal} from "./controller/modalManager.js";



function init() {
  boardsManager.loadBoards();
  initRenameModal();
  initRenameCardModal();
  initRenameColumnModal();
  // setInterval(function () {refresh_after_click()}, 10000);
}

init();
