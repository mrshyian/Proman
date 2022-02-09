import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import * as dnd from "../view/dragndrop.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cardsFromBase = await dataHandler.getCardsByBoardId(boardId);
        const renderedCardIds = getRenderedCardIds(boardId);
        for (let card of cardsFromBase.filter(card => !renderedCardIds.has(card.id))) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            const cardStatusId = await dataHandler.getStatus(card.id);

            domManager.addChild(`.board-columns[data-board-id="${boardId}"] .board-column-content[data-status-id="${cardStatusId}"]`, content);
            domManager.addEventListener(
                `.card`+`.draggable[data-card-id="${card.id}"]>.card-content>.card-options>.card-archive`,
                "click",
                archiveButtonHandler
            );
            domManager.addEventListener(
                `.card`+`.draggable[data-card-id="${card.id}"]>.card-content>.card-options>.card-remove`,
                "click",
                deleteButtonHandler
            );
            domManager.addEventListener(
                `.card`+`.draggable[data-card-id="${card.id}"]>.card-content>.card-title`,
                "dblclick",
                changeCardName
            );
        }
        dnd.initDragAndDrop();
    },
    hideCards: async function (boardId){
        domManager.deleteChild(`.board-columns[data-board-id="${boardId}"]`);
    }
};

export async function deleteButtonHandler(clickEvent) {
    let target = clickEvent.target.parentElement.parentElement.parentElement.parentElement;
    const cardId = target.dataset.cardId;
    await dataHandler.deleteCard(cardId);
    target.remove();

}

async function archiveButtonHandler(clickEvent) {
    let target = clickEvent.target.parentElement.parentElement.parentElement.parentElement;
    const cardId = target.dataset.cardId;
    const isArchivedStatus = target.getAttribute('data-is-archived-status');
    await dataHandler.changeCardArchiveStatus(cardId, isArchivedStatus);
    target.remove();
}

export function changeCardName(dblclickEvent) {
    let target = dblclickEvent.target;


    if (target.classList.contains('card-remove')) {
        return;
    }
    if (target.classList.contains('card-title')) {
        target = target.parentElement.parentElement;

    }

    const cardId = target.dataset.cardId;
    const cards = document.getElementsByClassName("card");
    console.log(cards);

    for (let card of cards) {
        if (card.getAttribute('data-card-id') === cardId) {
            activateRenameCardModal(cardId);
        }
    }
}


function activateRenameCardModal(cardId) {
    const input = document.getElementById('new-name-for-card');
    input.value =  "";
    $("#modal-for-rename-card").modal();
    document.getElementById("submit-button-rename-card").setAttribute('data-card-id', cardId);
}


function getRenderedCardIds(boardId) {
    const cardsOnBoard = getCardsOnBoard(boardId);
    const existCardIds = new Set();

    for (const card of cardsOnBoard) {
        const cardId = +card.dataset.cardId;
        existCardIds.add(cardId);
    }

    return existCardIds;
}

function getCardsOnBoard(boardId) {
    const boardComponents = document.querySelector(`.board[data-board-id="${boardId}"]`);
    const cardsOnBoard = boardComponents.getElementsByClassName("card");

    return cardsOnBoard;
}

