export let dataHandler = {
    getBoards: async function () {
        const response = await apiGet(`/api/boards`);
        return response;
    },
    getBoard: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/`);
        return response;
    },
    getStatuses: async function () {
        const response = await apiGet(`/api/statuses`);
        return response;
    },
    getStatus: async function (statusId) {
        const response = await apiGet(`/api/statuses/${statusId}/`);
        return response;
    },
    getCardsByBoardId: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/cards/`);
        return response;
    },
    getCard: async function (cardId) {
        const response = await apiGet(`/api/boards/cards/${cardId}/`);
        return response;
    },
    createNewBoard: async function (boardTitle) {
        location.reload()
        const response = await apiGet(`/api/add_new_board/`);
        return response;
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
    },
    deleteAnyBoard: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/delete/`);
        return response;
    },
    updateBoardTitle: async function (new_title, boardId) {
        const response = await apiGet(`/api/boards/${boardId}/${new_title}/`);
        return response;
    },
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.status === 200) {
        let data = response.json();
        return data;
    }
}

async function apiPost(url, payload) {
}

async function apiDelete(url) {
}

async function apiPut(url) {
}
