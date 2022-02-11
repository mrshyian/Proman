export let dataHandler = {
    getBoards: async function () {
        const response = await apiGet(`/api/boards`);
        return response;
    },
    getStatuses: async function (boardId) {
        const response = await apiGet(`/api/statuses/${boardId}/`);
        return response;
    },
    createNewColumn: async function (boardId) {
        await apiPost(`/api/boards/${boardId}/columns/`);
    },
    getStatus: async function (cardId) {
        const response = await apiGet(`/api/cards/${cardId}/status/`);
        return response[0]['status_id'];
    },
    getCardsByBoardId: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/cards/`);
        return response;
    },
    getArchivedCardsByBoardId: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/cards/archived`);
        return response;
    },
    // getCard: async function (cardId) {
    //     const response = await apiGet(`/api/boards/cards/${cardId}/`);
    //     return response;
    // },
    createNewBoard: async function () {
        const response = await apiPost('/api/boards');
        return response;

    },
    createNewCard: async function (boardId, statusId) {
        const response = await apiPost(`/api/boards/${boardId}/card/${statusId}`);
        return response;
    },
    deleteCard: async function (cardId) {
        const data = { 'id': cardId };
        await apiDelete(`/api/boards/cards/${cardId}/`, data);
    },
    deleteAnyColumn: async function (columnId) {
        const data = { 'id': columnId };
        await apiDelete(`/api/boards/columns/${columnId}/`, data);
    },
    deleteAnyBoard: async function (boardId) {
        const data = { 'id': boardId };
        await apiDelete('/api/boards', data);
    },
    updateBoardTitle: async function (newTitle, boardId, user_name, user_id) {
        const data = {
            'id': boardId,
            'title': newTitle,
            'user_name': user_name,
            'user_id': user_id
        };
        await apiPut(`/api/boards`, data);
    },
    updateCardTitle: async function (newTitle, cardId) {
        const data = {
            'id': cardId,
            'title': newTitle
        };
        await apiPut(`/api/boards/cards/${cardId}/`, data);
    },
    changeCardArchiveStatus: async function (cardId, isArchivedStatus) {
        const data = {
            'id': cardId,
            'is_archived_status': isArchivedStatus
        };
        const response = await apiPut(`/api/board/cards/${cardId}/archive`, data);
        return response;
    },
    updateCardStatus: async function (boardId, cardId, newStatus) {
        const data = {
            'board_id': boardId,
            'id': cardId,
            'status_id': newStatus
        };
        await apiPut(`/api/boards/cards/statuses/${boardId}/${cardId}/${newStatus}`, data);
    },

    updateColumnTitle: async function (newTitle, columnId) {
        const data = {
            'id': columnId,
            'title': newTitle
        };
        await apiPut(`/api/boards/columns/${columnId}/`, data);
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
        const receivedData = await response.json();
        console.log("PUT sent successfully")
        return receivedData;
    }
}
