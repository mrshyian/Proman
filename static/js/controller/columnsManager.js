

export async function deleteColumn(clickEvent) {
    let target = clickEvent.target.parentElement;
    target.remove();
}