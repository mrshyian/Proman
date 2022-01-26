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
    return `<div class="board-container" data-board-id=${board.id}>
                <div class="board" data-board-id=${board.id}>
                    <div class="board-header">
                        <div class="board-title" data-board-id="${board.id}">${board.title}</div> 
                        <button class="button-delete-board toggle-board-button" data-board-id="${board.id}-close">Delete board</button>
                        <button class="button-show-cards toggle-board-button" data-board-id="${board.id}">Show Cards</button>
                        <button  class="button-add-card toggle-board-button" data-board-id="${board.id}-add-card">Add card</button>
                    </div>
                    <table class="table">
                        <tr class="tr-class" data-board-id=${board.id}></tr>
                    </table>
                </div>
          
            </div>`;
}

function cardBuilder(card) {
    return `<td><div class="card" data-card-id="${card.id}">${card.title}</div></td>`;
}


export function newBoardButtonBuilder() {
    return `<button id="new-board" class="button-add-board toggle-board-button">New Board</button>`
}

