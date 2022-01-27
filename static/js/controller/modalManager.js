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


export function initRenameCardModal(){
    const submitButton = document.getElementById("submit-button-rename-card");
    submitButton.addEventListener("click",async function(){
        const cardId = submitButton.dataset.cardId;
        const input = document.getElementById('new-name-for-card');
        const value =  input.value;

        if (value.length < 4){
            return;
        }

        await dataHandler.updateCardTitle(value, cardId);

        renameCard(cardId, value);
    })
}


function renameCard(cardId, value){
    const boardTitle = document.querySelector(`.card[data-card-id="${cardId}"]`);
    boardTitle.innerHTML = value;
}


function renameBoard(boardId, value){
    const boardTitle = document.querySelector(`.board-title[data-board-id="${boardId}"]`);
    boardTitle.innerHTML = value;
}