import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates, newBoardButtonBuilder, statusColumnsBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager, deleteButtonHandler, changeCardName} from "./cardsManager.js";
import * as dnd from "../view/dragndrop.js";

export let boardsManager = {
    loadBoards: async function () {
        addButtonNewBoard()
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            await createBoard(board);
        }
    },
};


async function showHideButtonHandler(clickEvent) {
    const buttonName = clickEvent.target.textContent;
    const boardId = clickEvent.target.dataset.boardId;
    if (buttonName === 'Show Cards'){
        const statusContent = await statusColumnsBuilder();
        domManager.addChild(`.board-columns[data-board-id="${boardId}"]` , statusContent);
        await cardsManager.loadCards(boardId);
        clickEvent.target.innerHTML = 'Hide Cards'
    } else if (buttonName === 'Hide Cards'){
        clickEvent.target.innerHTML = 'Show Cards'
        await cardsManager.hideCards(boardId);
    }
}

async function deleteBoard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    clickEvent.target.parentNode.parentNode.remove();
    await dataHandler.deleteAnyBoard(boardId);
}


// export async function deleteButtonHandler(clickEvent) {
//     let target = clickEvent.target.parentElement;
//
//     const cardId = target.dataset.cardId;
//     await dataHandler.deleteCard(cardId);
//     target.remove();
//
// }



function addButtonNewBoard() {
    const content = newBoardButtonBuilder()
    domManager.addChild("#root", content);
    domManager.addEventListener(
        "#new-board",
        "click",
        createNewBoard
    );

}

async function createNewBoard(){
    const board = await dataHandler.createNewBoard();
    await createBoard(board);
}

async function createBoard(board){
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = await boardBuilder(board);
    domManager.addChild("#root", content);
    domManager.addEventListener(
        `.toggle-board-button[data-board-id="${board.id}"]`,
        "click",
        showHideButtonHandler
    );
    domManager.addEventListener(
        `.delete-board-button[data-board-id="${board.id}"]`,
        "click",
        deleteBoard
    );
    domManager.addEventListener(
        `.board-title[data-board-id="${board.id}"]`,
        "click",
        changeBoardName
    );
    domManager.addEventListener(
        `.add-card-button[data-board-id="${board.id}"]`,
        "click",
        addCard
    );
}


function changeBoardName(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const boards = document.getElementsByClassName("board-title");
    for (let board of boards) {
        if (board.getAttribute('data-board-id') === boardId) {
            activateRenameBoardModal(boardId);
        }
    }
}


function activateRenameBoardModal(boardId) {
    const input = document.getElementById('new-name-for-board');
    input.value =  "";

    $("#modal-for-rename").modal();
    document.getElementById("submit-button-rename").setAttribute('data-board-id', boardId);
}


async function addCard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const card = await dataHandler.createNewCard(boardId);
    const cardStatusId = card["status_id"];
    const cardBuilder = htmlFactory(htmlTemplates.card);
    const content = cardBuilder(card);

    domManager.addChild(`.board-columns[data-board-id="${boardId}"] .board-column-content[data-status-id="${cardStatusId}"]`, content);
    domManager.addEventListener(
        `.card`+`.draggable[data-card-id="${card.id}"]>.card-remove`,
        "click",
        deleteButtonHandler
    );
    domManager.addEventListener(
        `.card`+`.draggable[data-card-id="${card.id}"]`,
        "dblclick",
        changeCardName
    );

     dnd.initDragAndDrop();
}
