import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";

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


function renameBoard(boardId, value){
    const boardTitle = document.querySelector(`.board-title[data-board-id="${boardId}"]`);
    boardTitle.innerHTML = value;
}


export async function changeArchivedModalInnerHTML(board, archivedCardListModal){
    const boardId = board.id;
    const modalHeader = archivedCardListModal.querySelector('.modal-header');
    modalHeader.insertAdjacentHTML('beforeend','<span class="modal-close" style="position: absolute; top: 5%; right: 1%;  width: 20px; cursor: pointer; background-color: lightgray; text-align: center;">x</span>')
    const modalCloseButton = modalHeader.querySelector('span.modal-close');
    modalCloseButton.addEventListener('click', closeModal);
    const modalTitle = archivedCardListModal.querySelector('.modal-title');
    modalTitle.innerText = "Archived Cards: ";
    const modalBody = archivedCardListModal.querySelector('.modal-body');
    modalBody.innerHTML = "";
    const archivedCardsList = await dataHandler.getArchivedCardsByBoardId(boardId);
    for (const card of archivedCardsList){
        const archivedCardBuilder = htmlFactory(htmlTemplates.archivedCard);
        const archivedCard = archivedCardBuilder(card);
        modalBody.insertAdjacentHTML('beforeend',archivedCard);
        const cardRestoreButton = modalBody.querySelector('.card-restore');
        cardRestoreButton.addEventListener('click', restoreArchivedCard);
    }
}

async function restoreArchivedCard(clickEvent){
    const archivedCard = clickEvent.target.parentElement.parentElement;
    const cardId = archivedCard.getAttribute('data-card-id');
    const isArchivedStatus = archivedCard.getAttribute('data-is-archived-status');
    await dataHandler.changeCardArchiveStatus(cardId, isArchivedStatus);
    archivedCard.remove();
}

function closeModal(){
    $("#modal-for-archived-cards").modal('hide');
}