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
            if (!sessionStorage.getItem('user_id')) {
                if (board['user_id'] === 0) {
                    await createBoard(board);
                }
            } else {
                if (board['user_id'] === 0 || board['user_id'] === parseInt(sessionStorage.getItem('user_id'))) {
                    await createBoard(board);
                }
            }
        }
    },
};


async function showHideButtonHandler(clickEvent) {
    const buttonName = clickEvent.target.parentElement.dataset.btnName;
    const boardId = clickEvent.target.parentElement.dataset.boardId;
    if (buttonName === 'show') {
        const statusContent = await statusColumnsBuilder(boardId);
        domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, statusContent);
        await cardsManager.loadCards(boardId);
        await addEventOnAllColumns(boardId);
        clickEvent.target.parentElement.setAttribute('data-btn-name','hide');
        clickEvent.target.parentElement.innerHTML = '<i class="material-icons-outlined">expand_less</i>';
    } else if (buttonName === 'hide') {
        clickEvent.target.parentElement.setAttribute('data-btn-name','show');
        clickEvent.target.parentElement.innerHTML = '<i class="material-icons-outlined">expand_more</i>';
        await cardsManager.hideCards(boardId);
    }
}

async function deleteBoard(clickEvent) {
    const boardId = clickEvent.target.parentElement.dataset.boardId;
    clickEvent.target.parentElement.parentElement.parentElement.parentElement.remove();
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
        () => showArchivedCardList(board)
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
    const boardId = clickEvent.target.parentElement.dataset.boardId;
    const card = await dataHandler.createNewCard(boardId);
    const cardStatusId = card["status_id"];
    const cardBuilder = htmlFactory(htmlTemplates.card);
    const content = cardBuilder(card);

    domManager.addChild(`.board-columns[data-board-id="${boardId}"] .board-column[data-status-id="${cardStatusId}"] .board-column-content[data-status-id="${cardStatusId}"]`, content);
    domManager.addEventListener(
        `.card` + `.draggable[data-card-id="${card.id}"]>.card-content>.card-options>.card-remove`,
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
    const boardId = clickEvent.target.parentElement.dataset.boardId;
    let allColumns = await dataHandler.getStatuses(boardId);
    if (allColumns.length<8) {
        await dataHandler.createNewColumn(boardId);
        document.getElementById('root').innerHTML = ""
        addButtonNewBoard()
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            await createBoard(board);
        }
        const showHideBoardButton = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`);
        showHideBoardButton.click();
    } else {
        alert('So much columns')
    }
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
    const statusId = clickEvent.target.parentElement.dataset.statusId;
    console.log(statusId);
    clickEvent.target.parentElement.parentElement.parentElement.parentElement.remove();
    await dataHandler.deleteAnyColumn(statusId);
}

function changeColumnName(clickEvent) {
    let statusId = clickEvent.target.dataset.statusId;
    activateRenameColumnModal(statusId);
}

function activateRenameColumnModal(statusId) {
    const input = document.getElementById('new-name-for-column');
    input.value = "";

    $("#modal-for-rename-column").modal();
    document.getElementById("submit-button-rename-column").setAttribute('data-column-id', statusId);
}

async function showArchivedCardList(board) {
    let archivedCardListModal = document.getElementById('modal-for-archived-cards');

    if (!archivedCardListModal) {
        const renameModal = document.getElementById('modal-for-rename');
        archivedCardListModal = renameModal.cloneNode(true);
        archivedCardListModal.setAttribute('id', 'modal-for-archived-cards');

        const modalHeader = archivedCardListModal.querySelector('.modal-header');
        modalHeader.insertAdjacentHTML('beforeend', '<span class="modal-close" style="position: absolute; top: 5%; right: 1%;  width: 20px; cursor: pointer; background-color: lightgray; text-align: center;">x</span>')
        const modalCloseButton = modalHeader.querySelector('span.modal-close');
        modalCloseButton.addEventListener('click', closeModal);
    }
    await changeArchivedModalInnerHTML(board, archivedCardListModal);
    const body = document.getElementsByTagName('body')[0];
    body.insertBefore(archivedCardListModal, null);
    $("#modal-for-archived-cards").modal();
}

export async function refresh_after_click() {
    const boards = await dataHandler.getBoards();
    let listOfShowHideButtonDict = [];
    for (let board of boards) {
        let showHideButtonDict = {};
        showHideButtonDict['button_content'] = document.querySelector(`.toggle-board-button[data-board-id="${board.id}"]`).textContent;
        showHideButtonDict['board_id'] = board.id;
        listOfShowHideButtonDict.push(showHideButtonDict);
    }
    console.log(listOfShowHideButtonDict);
    document.getElementById('root').innerHTML = ""
    addButtonNewBoard();
    for (let board of boards) {
        if (!sessionStorage.getItem('user_id')) {
            if (board['user_id'] === 0) {
                await createBoard(board);
                for (let dict of listOfShowHideButtonDict) {
                    if (dict['board_id'] === board.id && dict['button_content'] === 'Hide Cards') {
                        document.querySelector(`.toggle-board-button[data-board-id="${board.id}"]`).click()
                    }
                }
            }
        } else {
            if (board['user_id'] === 0 || board['user_id'] === parseInt(sessionStorage.getItem('user_id'))) {
                await createBoard(board);
                for (let dict of listOfShowHideButtonDict) {
                    if (dict['board_id'] === board.id && dict['button_content'] === 'Hide Cards') {
                        document.querySelector(`.toggle-board-button[data-board-id="${board.id}"]`).click()
                    }
                }
            }
        }
    }
}