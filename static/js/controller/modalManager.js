import {dataHandler} from "../data/dataHandler.js";

export function initRenameModal(){
    const submitButton = document.getElementById("submit-button-rename");
    submitButton.addEventListener("click",async function(){
        const boardId = submitButton.dataset.boardId;
        const input = document.getElementById('new-name-for-board');
        const value =  input.value;

        if (value.length < 4){
            return;
        }

        await dataHandler.updateBoardTitle(value, boardId);

        renameBoard(boardId, value);
    })
}


function renameBoard(boardId, value){
    const boardTitle = document.querySelector(`.board-title[data-board-id="${boardId}"]`);
    boardTitle.innerHTML = value;

}