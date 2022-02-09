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
    const cardTitle = document.querySelector(`.card[data-card-id="${cardId}"]>.card-title`);
    cardTitle.innerHTML = value;
}


function renameColumn(columnId, value){
    const columnTitle = document.querySelector(`.board-column-title[data-status-id="${columnId}"]`);
    columnTitle.innerHTML = value;
}


function renameBoard(boardId, value){
    const boardTitle = document.querySelector(`.board-title[data-board-id="${boardId}"]`);
    boardTitle.innerHTML = value;
}


export function initRenameColumnModal(){
    const submitButton = document.getElementById("submit-button-rename-column");
    submitButton.addEventListener("click",async function(){
        const columnId = submitButton.dataset.columnId;
        const input = document.getElementById('new-name-for-column');
        const value =  input.value;

        if (value.length < 4){
            return;
        }

        await dataHandler.updateColumnTitle(value, columnId);

        renameColumn(columnId, value);
    })
}