const { pipe } = rxjs;

document.addEventListener("DOMContentLoaded", initListeners)

function initListeners() {
    document.getElementById('.id-input')
    document.getElementById('.year-input')
    document.getElementById('get-button')

}

function getValuation(id, year) {
    const equipment = getData(id);
    equipment.pipe((res) => {

    });
}