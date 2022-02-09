import {dataHandler} from "../data/dataHandler.js";

export const htmlTemplates = {
    board: 1,
    card: 2,
    archivedCard: 3
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        case htmlTemplates.archivedCard:
            return archivedCardBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}


function boardBuilder(board) {
    let htmlBlockBoard =
        `<div class="board" data-board-id="${board.id}">
               <div class="board-header">
                  <span class="board-title" data-board-id="${board.id}">${board.title}</span> 
                  <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
                  <button class="add-card-button" data-board-id="${board.id}">Add Card</button>
                  <button class="archived-cards-button" data-board-id="${board.id}">Archived Cards</button>
                  <button class="delete-board-button" data-board-id="${board.id}">Delete</button>
               </div> 
                  <div class="board-columns" data-board-id="${board.id}" style="display:flex; flex-wrap:wrap;">
                  </div>
        </div>`;
    return htmlBlockBoard;
}


export async function statusColumnsBuilder(){
    let cardStatuses =  await dataHandler.getStatuses();
    let htmlBlock = ``;
    const amountOfColumns = cardStatuses.length;

    for (const status of cardStatuses){

        const div = `<div class="board-column" data-status-id="${status.id} style="width: calc(100%/${amountOfColumns});">
            <div class="board-column-title" data-status-id="${status.id}">${status['title']}</div>
            <div class="board-column-content drop-zone" data-status-id="${status.id}" ></div>
        </div>`;
        htmlBlock += div;
    }
    return htmlBlock;
}

function cardBuilder(card) {
     return `<div class="card draggable" data-card-id="${card.id}" data-is-archived-status="${card.is_archived}" draggable="true" style="width: 90%; text-align: center; display: block;">
        <span class="card-title" style="display: block; position: relative; margin-right: calc(10% + 20px); min-height: 20px;">${card.title}</span>
        <span class="card-archive" style='position: absolute; top: calc(50% - 10px); right: 10%;  width: 20px; cursor: pointer;'id="${card.id}"><i class="fa fa-archive" aria-hidden="true"></i></span>
        <span class="card-remove" style='position: absolute; top: 5%; right: 1%;  width: 20px; cursor: pointer; background-color: lightgray;'id="${card.id}-span">x</span>
        </div>`
}


function archivedCardBuilder(card) {
     return `<div class="archived-card" data-card-id="${card.id}" data-is-archived-status="${card.is_archived}" style="text-align: center; display: block;">
        <span class="card-title" style="display: block; position: relative; margin-right: calc(10% + 20px); min-height: 20px;">${card.title}</span>
        <span class="card-restore" style='position: absolute; top: calc(50% - 10px); right: 10%;  width: 20px; cursor: pointer;' data-card-id="${card.id}"><i class="fa fa-share" aria-hidden="true"></i></span>
        </div>`
}


export function newBoardButtonBuilder() {
    return `<button id="new-board" class="button-add-board toggle-board-button">New Board</button>`
}

