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
            createBoard(board);
        }
    },
};


function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    cardsManager.loadCards(boardId);
}

function deleteBoard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    clickEvent.target.parentNode.parentNode.parentNode.remove();
    dataHandler.deleteAnyBoard(boardId)
}

function addButtonNewBoard() {
    var content = newBoardButtonBuilder()
    domManager.addChild("#root", content);
    domManager.addEventListener(
        "#new-board",
        "click",
        createNewBoard
    );

}

async function createNewBoard(){
    const board = await dataHandler.createNewBoard();
    createBoard(board);
}

function createBoard(board){
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(board);
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
