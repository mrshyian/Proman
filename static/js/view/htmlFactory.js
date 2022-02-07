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
        `<div class="board" data-board-id="${board.id}">
               <div class="board-header">
                  <span class="board-title" data-board-id="${board.id}">${board.title}</span> 
                  <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
                  <button class="add-card-button" data-board-id="${board.id}">Add Card</button>
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
        // const div = `<div class="status-column" data-status-id="${status.id}" style="width: calc(100%/${amountOfColumns}); text-align: center; vertical-align: middle;"> ${status['title']}</div>`;
        //const div = `<div class="board-column" data-status-id="${status.id}">${status['title']}</div>`;

        const div = `<div class="board-column" data-status-id="${status.id}">
            <div class="board-column-title" data-status-id="${status.id}">${status['title']}</div>
            <div class="board-column-content drop-zone" data-status-id="${status.id}" ></div>
        </div>`;
        htmlBlock += div;
    }
    return htmlBlock;
}

function cardBuilder(card) {
    //return `<div class="card" data-card-id="${card.id}" style="width: 90%; text-align: center; display: block; float:right"><span class="card-title">${card.title}</span><span class="card-remove" style='float: right; text-align: center; width: 20px; cursor: pointer; background-color: lightgray;' id="${card.id}-span">x</span></div>`;
    //return `<div class="card draggable" data-card-id="${card.id}" draggable="true" style="width: 90%; text-align: center; display: block; float:right">${card.title}<span style='float: right; text-align: center; width: 20px; cursor: pointer; background-color: lightgray;' id="${card.id}-span">x</span></div>`;
    return `<div class="card draggable" data-card-id="${card.id}" draggable="true" style="width: 90%; text-align: center; display: block; float:right">
        <span class="card-title">${card.title}</span>
        <span class="card-remove" style='float: right; text-align: center; width: 20px; cursor: pointer; background-color: lightgray;'id="${card.id}-span">x</span>
        </div>`
}


export function newBoardButtonBuilder() {
    return `<button id="new-board" class="button-add-board toggle-board-button">New Board</button>`
}

