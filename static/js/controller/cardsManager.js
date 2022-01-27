import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates, statusColumnsBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cardsFromBase = await dataHandler.getCardsByBoardId(boardId);
        const renderedCardIds = getRenderedCardIds(boardId);
        for (let card of cardsFromBase.filter(card => !renderedCardIds.has(card.id))) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            const cardStatusId = await dataHandler.getStatus(card.id);

            domManager.addChild(`.board-columns[data-board-id="${boardId}"] .board-column[data-status-id="${cardStatusId}"] .board-column-content[data-status-id="${cardStatusId}"]`, content);
            domManager.addEventListener(
                `[id="${card.id}-span"]`,
                "click",
                deleteButtonHandler
            );
        }

    },
    hideCards: async function (boardId){
        domManager.deleteChild(`.board-columns[data-board-id="${boardId}"]`);
    }
};

export async function deleteButtonHandler(clickEvent) {
    const cardId = clickEvent.target.parentElement.dataset.cardId;
    await dataHandler.deleteCard(cardId);
    clickEvent.target.parentElement.remove();

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
