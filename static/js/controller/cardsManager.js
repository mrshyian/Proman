import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";

export let cardsManager = {
 loadCards: async function (boardId) {
    const cards = await dataHandler.getCardsByBoardId(boardId);
    const boardComponents = document.querySelector(`.board[data-board-id="${boardId}"]`);
    const cardsOnBoard = boardComponents.getElementsByClassName("card");

    const existCardIds = new Set();

    for(const card of cardsOnBoard){
        const cardId = +card.dataset.cardId;
        existCardIds.add(cardId);
    }

    for (let card of cards.filter(card => !existCardIds.has(card.id))) {
      const cardBuilder = htmlFactory(htmlTemplates.card);
      const content = cardBuilder(card);
      domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
      domManager.addEventListener(
        `.card[data-card-id="${card.id}"]`,
        "click",
        deleteButtonHandler
      );
    }
  },
};

function deleteButtonHandler(clickEvent) {
  clickEvent.target.remove();
}
