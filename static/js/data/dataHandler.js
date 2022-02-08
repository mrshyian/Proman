export let dataHandler = {
    getBoards: async function () {
        const response = await apiGet(`/api/boards`);
        return response;
    },
    // getBoard: async function (boardId) {
    //     const response = await apiGet(`/api/boards/${boardId}/`);
    //     return response;
    // },
    getStatuses: async function () {
        const response = await apiGet(`/api/statuses`);
        return response;
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
    createNewCard: async function (boardId) {
        const response = await apiPost(`/api/boards/${boardId}/card/`);
        return response;
    },
    deleteCard: async function (cardId) {
        const data = { 'id': cardId };
        await apiDelete(`/api/boards/cards/${cardId}/`, data);
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
        await apiPut(`/api/board/cards/${cardId}/archive`, data);
    },

    // getUserBuyUserId: async function (email) {
    //     const response = await apiGet(`/api/login/${email}/`);
    //     console.log(response)
    //     return response;
    // },
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
