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


function boardBuilder(board) {
    return `<div class="board" data-board-id="${board.id}">
               <div class="board-header">
                  <div class="board-title" data-board-id="${board.id}">${board.title} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${board['user_name']}</div> 
                  <div class="board-options">
                      <button class="btns toggle-board-button" data-board-id="${board.id}" data-btn-name="show"><i class="material-icons-outlined">expand_more</i></button>
                      <button class="btns add-card-button" data-board-id="${board.id}"><i class="material-icons-outlined">add</i></button>
                      <button class="btns add-column-button" data-board-id="${board.id}"><i class="material-icons-outlined">post_add</i></button>
                      <button class="btns archived-cards-button" data-board-id="${board.id}"><i class="material-icons-outlined">inventory_2</i></button>
                      <button class="btns delete-board-button" data-board-id="${board.id}"><i class="material-icons-outlined">delete</i></button>
                  </div>
               </div> 
                  <div class="board-columns" data-board-id="${board.id}" style="display:flex; flex-wrap:wrap;">
                  </div>
        </div>`;
}


export async function statusColumnsBuilder(boardId) {
    let cardStatuses = await dataHandler.getStatuses(boardId);
    let htmlBlock = ``;
    const amountOfColumns = cardStatuses.length;
    for (const status of cardStatuses) {
        const div = `<div class="board-column" data-status-id="${status.id}" style="width: calc(100%/${amountOfColumns}); text-align: center; display: block; float:right"">
                        <div class="board-column-header">
                            <div class="board-column-title" data-status-id="${status.id}">${status['title']}</div>
                            <div class="column-options">
                                <div class="add-column" data-status-id="${status.id}" id="${status['id']}-add"><i class="material-icons-outlined">add</i></div>
                                <div class="column-remove" data-status-id="${status.id}" id="${status['id']}-span"><i class="fas fa-trash-alt"></i></div>
                            </div>
                        </div>
                        <div class="board-column-content drop-zone" data-status-id="${status.id}"></div>
                    </div>`;
             htmlBlock += div;
    }

    return htmlBlock;
}


function cardBuilder(card) {
     return `<div class="card draggable" data-card-id="${card.id}" data-is-archived-status="${card.is_archived}" draggable="true">
           <div class="card-content">
                <div class="card-options">
                    <div class="card-archive" id="${card.id}"><i class="fa fa-inbox"></i></div>
                    <div class="card-remove" id="${card.id}-span"><i class="fas fa-trash-alt"></i></div>
                </div>
           <div class="card-title">${card.title}</div>
           </div>
        </div>`
}


function archivedCardBuilder(card) {
     return `<div class="archived-card" data-card-id="${card.id}" data-is-archived-status="${card.is_archived}" style="text-align: center; display: block;">
        <span class="card-title" style="display: block; position: relative; margin-right: calc(10% + 20px); min-height: 20px;">${card.title}</span>
        <span class="card-restore" style='position: absolute; top: calc(50% - 10px); right: 10%;  width: 20px; cursor: pointer;' data-card-id="${card.id}"><i class="fa fa-share" aria-hidden="true"></i></span>
        </div>`
}


export function newBoardButtonBuilder() {
    return `<div class="boards-header"><button id="new-board" class="button-add-board toggle-board-button">New Board</button></div>`
}

