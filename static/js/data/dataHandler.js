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
    createNewBoard: async function () {
        const response = await apiPost('/api/boards');
        return response;

    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
    },
    deleteAnyBoard: async function (boardId) {
        const data = { 'id': boardId };
        await apiDelete('/api/boards', data);
    },
    updateBoardTitle: async function (newTitle, boardId) {
        const data = {
                    'id': boardId,
                    'title': newTitle
        };
        await apiPut(`/api/boards`, data);
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

async function apiPost(url) {
    let response = await fetch(url, {
        method: "POST",
    });
    if (response.status === 200) {
        return await response.json();
    }
}

async function apiDelete(url, data) {
    let response = await fetch(url, {
        method: "DELETE",
        headers: {
      'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if (response.status === 200) {
        await response.json();
        console.log("Successful DELETE operation")
    }
}

async function apiPut(url, data) {
    let response = await fetch(url, {
        method: "PUT",
        headers: {
      'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if (response.status === 200) {
        await response.json();
        console.log("PUT sent successfully")
    }
}
