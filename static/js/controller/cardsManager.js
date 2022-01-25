import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";

export let cardsManager = {
 loadCards: async function (boardId) {
    const cards = await dataHandler.getCardsByBoardId(boardId);
    // const boardContainer = document.querySelector(".board-container");
    // const boardComponents = boardContainer.children[0];
    // const boardHeaderBlock = boardComponents.children[0];
    // const boardHeaderBlock = boardComponents.children[0];
    // console.log(boardComponents)
    // console.log(boardHeaderBlock)
    //
    // console.log(boardComponents.children)
    //
    // for(let i=0; i<=boardComponents.children.length; i++){
    //     const component =  boardComponents.children[i];
    //     console.log(component);
    //
    // }
    // console.log(boardContainer)

    for (let card of cards) {
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
