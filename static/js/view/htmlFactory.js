import {dataHandler} from "../data/dataHandler.js";

export const htmlTemplates = {
    board: 1,
    card: 2
}


export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}


function boardBuilder(board) {
    let htmlBlockBoard =
        `<div class="board-container" data-board-id="${board.id}">
            <div class="board" data-board-id="${board.id}">
               <div class="board-header">
                  <div class="board-title" data-board-id="${board.id}">${board.title}</div> 
                        <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
                        <button class="add-card-button" data-board-id="${board.id}">Add Card</button>
                        <button class="delete-board-button" data-board-id="${board.id}">Delete</button>
                  </div> 
                  <div class="board-body-wrapper" data-board-id="${board.id}" style="display:flex; flex-wrap:wrap;">
                  </div>
               </div>
        </div>`;

    return htmlBlockBoard;
}


// `<button class="button-show-cards toggle-board-button" data-board-id="${board.id}">Show Cards</button>
//  <button  class="button-add-card toggle-board-button" data-board-id="${board.id}-add-card">Add card</button>
// <button class="button-delete-board toggle-board-button" data-board-id="${board.id}-close">Delete board</button>`

export async function statusColumnsBuilder(){
    let cardStatuses =  await dataHandler.getStatuses();
    let htmlBlock = ``;

    for (const status of cardStatuses){
        const div = `<div class="status-column" data-status-id="${status.id}" style="width: 25%; text-align: center; vertical-align: middle;"> ${status['title']}</div>`;
        htmlBlock += div;
    }
    return htmlBlock;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" style="width: 90%; text-align: center">${card.title}<span style='display: inline' id="${card.id}-span">x</span></div>`;
}


export function newBoardButtonBuilder() {
    return `<button id="new-board" class="button-add-board toggle-board-button">New Board</button>`
}

