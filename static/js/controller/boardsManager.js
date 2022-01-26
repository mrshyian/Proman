import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates, newBoardButtonBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        addButtonNewBoard()
        const boards = await dataHandler.getBoards();
        console.log(boards)
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}-close"]`,
                "click",
                deleteBoard
            );
            domManager.addEventListener(
                `.board-title[data-board-id="${board.id}"]`,
                "click",
                changeBoardName
            );
        }
    },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    cardsManager.loadCards(boardId);
}

function deleteBoard(clickEvent) {
    clickEvent.target.parentNode.parentNode.parentNode.remove(); /* usuwa w JS NIE W BD */
    const boardId = clickEvent.target.dataset.boardId.slice(0, -6)
    dataHandler.deleteAnyBoard(boardId)
}

function addButtonNewBoard() {
    var content = newBoardButtonBuilder()
    domManager.addChild("#root", content);
    domManager.addEventListener(
        "#new-board",
        "click",
        dataHandler.createNewBoard
    );

}

function changeBoardName(clickEvent){
    const boardId = clickEvent.target.dataset.boardId;
    const boards = (document.getElementsByClassName("board-title"))
    for (var i=0; i<boards.length; i++){
        if (boards[i].getAttribute('data-board-id')===boardId){
            let boardName = window.prompt("enter new board name");
            boards[i].innerHTML = boardName
            dataHandler.updateBoardTitle(boardName, boardId)

        }

    }
}