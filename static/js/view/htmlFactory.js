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
            return () => {
                return ""
            }
    }
}

     // show boards: <i class="fa-solid fa-arrow-down-wide-short"></i>
     // hide boards: <i class="fa-solid fa-arrow-up-wide-short"></i>
    // add card: <i class="fa-solid fa-file-plus"></i>
    // delete board: <i class="fa-solid fa-folder-minus"></i>
    // add board: <i class="fa-solid fa-folder-plus"></i>


function boardBuilder(board) {
    return `<div class="board" data-board-id="${board.id}">
               <div class="board-header">
                  <div class="board-title" data-board-id="${board.id}">${board.title}</div> 
                  <div class="board-options">
                      <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
                      <button class="add-card-button" data-board-id="${board.id}">Add Card</button>
                      <button class="add-column-button" data-board-id="${board.id}">Add Column</button>
                      <button class="archived-cards-button" data-board-id="${board.id}">Archived Cards</button>
                      <button class="delete-board-button" data-board-id="${board.id}">Delete</button>
                  </div>
               </div> 
                  <div class="board-columns" data-board-id="${board.id}" style="display:flex; flex-wrap:wrap;">
                  </div>
        </div>`
}


export async function statusColumnsBuilder(boardId) {
    let cardStatuses = await dataHandler.getStatuses(boardId);
    let htmlBlock = ``;
    const amountOfColumns = cardStatuses.length;

    for (const status of cardStatuses) {

        const div = `<div class="board-column" data-status-id="${status.id}" style="width: calc(100%/${amountOfColumns}); text-align: center; display: block; float:right"">
                        <span class="board-column-title" data-status-id="${status.id}">${status['title']}</span>
                        <span class="column-remove" data-status-id="${status.id}" style='float: right; text-align: center; width: 20px; cursor: pointer; background-color: lightgray;' id="${status['id']}-span">x</span>
                        <div class="board-column-content drop-zone" data-status-id="${status.id}" ></div>
                    </div>`;
             htmlBlock += div;

    }
    return htmlBlock;
}


// <span class="card-title" style="display: block; position: relative; margin-right: calc(10% + 20px); min-height: 20px;">${card.title}</span>
// <span class="card-archive" style='position: absolute; top: calc(50% - 10px); right: 10%;  width: 20px; cursor: pointer;' id="${card.id}"><i class="fa fa-archive" aria-hidden="true"></i></span>
// <span class="card-remove" style='position: absolute; top: 5%; right: 1%;  width: 20px; cursor: pointer; background-color: lightgray;' id="${card.id}-span">x</span>


function cardBuilder(card) {
     return `<div class="card draggable" data-card-id="${card.id}" data-is-archived-status="${card.is_archived}" draggable="true" style="width: 90%; text-align: center; display: block;">
           <span class="card-title">${card.title}</span>
           <span class="card-archive" style='position: absolute; top: calc(50% - 10px); right: 10%;  width: 20px; cursor: pointer;'id="${card.id}"><i class="fa fa-archive" aria-hidden="true"></i></span>
           <span class="card-remove" id="${card.id}-span"><i class="fas fa-trash-alt"></i></span>
         
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

