import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates, newBoardButtonBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {

    loadBoards: async function () {
        var modal = document.getElementById("myModal");
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
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
    clickEvent.target.parentNode.parentNode.parentNode.remove();
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

function changeBoardName(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const boards = (document.getElementsByClassName("board-title"))
    for (let board of boards) {
        if (board.getAttribute('data-board-id') === boardId) {
            board.addEventListener("click", activateModal)
            console.log(board.textContent)
            document.getElementById("submit-button-rename").addEventListener("click", function (){let val = document.getElementById('new-name-for-board').value;
                                                                                                                            if (val.length < 4){
                                                                                                                                val = board.textContent
                                                                                                                            }
                                                                                                                            console.log(val);
                                                                                                                            board.innerHTML = val;
                                                                                                                            dataHandler.updateBoardTitle(val, boardId)})
                                                                                                                                }
    }
}

function activateModal() {
    $("#modal-for-rename").modal();
}
