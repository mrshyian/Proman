import {dataHandler} from "../data/dataHandler.js";


export function initDragAndDrop() {
    let draggables = document.querySelectorAll(".draggable");
    let dropZones = document.querySelectorAll(".drop-zone");
    initDraggables(draggables);
    initDropZones(dropZones);
}


export function initDraggables(draggables) {
    for (const draggable of draggables) {
        initDraggable(draggable);
    }
}

export function initDropZones(dropZones) {
    for (let dropZone of dropZones) {
        initDropZone(dropZone);
    }
}


export function initDraggable(draggable) {
    draggable.addEventListener("dragstart", dragStartHandler);
    draggable.addEventListener("drag", dragHandler);
    draggable.addEventListener("dragend", dragEndHandler);
    draggable.setAttribute("draggable", "true");
}


export function initDropZone(dropZone) {
    dropZone.addEventListener("dragenter", dropZoneEnterHandler);
    dropZone.addEventListener("dragover", dropZoneOverHandler);
    dropZone.addEventListener("dragleave", dropZoneLeaveHandler);
    dropZone.addEventListener("drop", dropZoneDropHandler);
}


export function dragStartHandler(e) {
    setDropZonesHighlight();
    let sourceBoardId = this.parentElement.parentElement.parentElement.getAttribute('data-board-id');
    this.classList.add('dragged', 'drag-feedback');
    this.setAttribute('source-board-id', sourceBoardId);
    e.dataTransfer.setData("type/dragged-box", 'dragged');
    e.dataTransfer.setData("text/plain", this.textContent.trim());
    deferredOriginChanges(this, 'drag-feedback');
}


function dragHandler() {
}


export function dragEndHandler() {
    setDropZonesHighlight(false);
    this.classList.remove('dragged');
    this.removeAttribute('source-board-id');
}


export function dropZoneEnterHandler(e) {
    if (e.dataTransfer.types.includes('type/dragged-box')) {
        this.classList.add("over-zone");
        e.preventDefault();
    }
}


export function dropZoneOverHandler(e) {
    if (e.dataTransfer.types.includes('type/dragged-box')) {
        e.preventDefault();
    }
}


export function dropZoneLeaveHandler(e) {
    if (e.dataTransfer.types.includes('type/dragged-box') &&
        e.relatedTarget !== null &&
        e.currentTarget !== e.relatedTarget.closest('.drop-zone')) {
        this.classList.remove("over-zone");
    }
}


export function dropZoneDropHandler(e) {
    let draggedElement = document.querySelector('.dragged');
    let sourceBoardId = draggedElement.getAttribute('source-board-id');
    let targetBoardId = e.currentTarget.parentElement.parentElement.getAttribute('data-board-id');
    let doIt = true;
    if (sourceBoardId !== targetBoardId) {
        if (!confirm("You are trying to move the card to another board, is it intended action?")) {
            doIt = false;
        }}
    if (doIt) {
        console.log('targetBoardId:' + targetBoardId);
        console.log('sourceBoardId:' + sourceBoardId);
        let newStatus = e.currentTarget.getAttribute('data-status-id');
        e.currentTarget.appendChild(draggedElement);
        let cards = e.currentTarget.getElementsByClassName('card draggable dragged');
        let cardId = cards[0].getAttribute('data-card-id');
        dataHandler.updateCardStatus(targetBoardId, cardId, newStatus);
    }

    e.preventDefault();
}


export function setDropZonesHighlight(highlight = true) {
    const dropZones = document.querySelectorAll(".drop-zone");
    for (const dropZone of dropZones) {
        if (highlight) {
            dropZone.classList.add("active-zone");
        } else {
            dropZone.classList.remove("active-zone");
            dropZone.classList.remove("over-zone");
        }
    }
}


export function deferredOriginChanges(origin, dragFeedbackClassName) {
    setTimeout(() => {
        origin.classList.remove(dragFeedbackClassName);
    });
}

