import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates, newBoardButtonBuilder, statusColumnsBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {closeModal, changeArchivedModalInnerHTML} from "./modalManager.js";
import {cardsManager, deleteButtonHandler, changeCardName} from "./cardsManager.js";
import * as dnd from "../view/dragndrop.js";

export let boardsManager = {
    loadBoards: async function () {
        addButtonNewBoard();
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            await createBoard(board);
        }
    },
};


async function showHideButtonHandler(clickEvent) {
    const buttonName = clickEvent.target.textContent;
    const boardId = clickEvent.target.dataset.boardId;
    if (buttonName === 'Show Cards') {
        const statusContent = await statusColumnsBuilder(boardId);
        domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, statusContent);
        await cardsManager.loadCards(boardId);
        await addEventOnAllColumns(boardId);
        clickEvent.target.innerHTML = 'Hide Cards'
    } else if (buttonName === 'Hide Cards') {
        clickEvent.target.innerHTML = 'Show Cards'
        await cardsManager.hideCards(boardId);
    }
}

async function deleteBoard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    clickEvent.target.parentNode.parentNode.remove();
    await dataHandler.deleteAnyBoard(boardId);
}

function addButtonNewBoard() {
    const content = newBoardButtonBuilder()
    domManager.addChild("#root", content);
    domManager.addEventListener(
        "#new-board",
        "click",
        createNewBoard
    );

}

async function createNewBoard() {
    const board = await dataHandler.createNewBoard();
    await createBoard(board);
}

async function createBoard(board) {
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
    domManager.addEventListener(
        `.add-card-button[data-board-id="${board.id}"]`,
        "click",
        addCard
    );
    domManager.addEventListener(
        `.add-column-button[data-board-id="${board.id}"]`,
        "click",
        createNewColumn
    );
    domManager.addEventListener(
        `.archived-cards-button[data-board-id="${board.id}"]`,
        "click",
        () =>  showArchivedCardList(board)
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
    input.value = "";

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
        `.card` + `.draggable[data-card-id="${card.id}"]>.card-remove`,
        "click",
        deleteButtonHandler
    );
    domManager.addEventListener(
        `.card` + `.draggable[data-card-id="${card.id}"]`,
        "dblclick",
        changeCardName
    );

    dnd.initDragAndDrop();
}


async function createNewColumn(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    await dataHandler.createNewColumn(boardId);
    document.getElementById('root').innerHTML = ""
    addButtonNewBoard()
    const boards = await dataHandler.getBoards();
    for (let board of boards) {
        await createBoard(board);
    }
    const showHideBoardButton = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`);
    showHideBoardButton.click();
}


async function addEventOnAllColumns(boardId) {
    let cardStatuses = await dataHandler.getStatuses(boardId);
    for (const status of cardStatuses) {
        domManager.addEventListener(
            `.column-remove[data-status-id="${status.id}"]`,
            "click",
            deleteColumn
        );
        domManager.addEventListener(
            `.board-column-title[data-status-id="${status.id}"]`,
            "click",
            changeColumnName
        );
    }
}


async function deleteColumn(clickEvent) {
    const statusId = clickEvent.target.dataset.statusId;
    clickEvent.target.parentNode.remove();
    await dataHandler.deleteAnyColumn(statusId);
}

function changeColumnName(clickEvent) {
    let statusId = clickEvent.target.dataset.statusId;
    activateRenameColumnModal(statusId);
}

function activateRenameColumnModal(statusId) {
    const input = document.getElementById('new-name-for-column');
    input.value =  "";

    $("#modal-for-rename-column").modal();
    document.getElementById("submit-button-rename-column").setAttribute('data-column-id', statusId);
}

async function showArchivedCardList(board){
    let archivedCardListModal = document.getElementById('modal-for-archived-cards');

    if (!archivedCardListModal){
        const renameModal = document.getElementById('modal-for-rename');
        archivedCardListModal = renameModal.cloneNode(true);
        archivedCardListModal.setAttribute('id', 'modal-for-archived-cards');

        const modalHeader = archivedCardListModal.querySelector('.modal-header');
        modalHeader.insertAdjacentHTML('beforeend','<span class="modal-close" style="position: absolute; top: 5%; right: 1%;  width: 20px; cursor: pointer; background-color: lightgray; text-align: center;">x</span>')
        const modalCloseButton = modalHeader.querySelector('span.modal-close');
        modalCloseButton.addEventListener('click', closeModal);
    }
    await changeArchivedModalInnerHTML(board, archivedCardListModal);
    const body = document.getElementsByTagName('body')[0];
    body.insertBefore(archivedCardListModal,null);
    $("#modal-for-archived-cards").modal();
}

