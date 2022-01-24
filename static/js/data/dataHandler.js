export let dataHandler = {
  getBoards: async function () {
    const response = await apiGet("/api/boards");
    return response;
  },
  getBoard: async function (boardId) {
    const response = await apiGet("/api/boards/${boardId}/");
    return response;
  },
  getStatuses: async function () {
    const response = await apiGet("/api/statuses");
    return response;
  },
  getStatus: async function (statusId) {
    const response = await apiGet("/api/statuses/${statusId}/");
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
    // creates new board, saves it and calls the callback function with its data
  },
  createNewCard: async function (cardTitle, boardId, statusId) {
    // creates new card, saves it and calls the callback function with its data
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

async function apiPost(url, payload) {}

async function apiDelete(url) {}

async function apiPut(url) {}
