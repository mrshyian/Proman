import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cardsFromBase = await dataHandler.getCardsByBoardId(boardId);
        const renderedCardIds = getRenderedCardIds(boardId);
        for (let card of cardsFromBase.filter(card => !renderedCardIds.has(card.id))) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            const cardStatusId = await dataHandler.getStatus(card.id);

            domManager.addChild(`.board-body-wrapper[data-board-id="${boardId}"] .status-column[data-status-id="${cardStatusId}"]`, content);
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
        }
    },
    hideCards: async function (boardId){
        domManager.deleteChild(`.board-body-wrapper[data-board-id="${boardId}"]`);
    }
};

export async function deleteButtonHandler(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    await dataHandler.deleteCard(cardId);
    clickEvent.target.remove();

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
