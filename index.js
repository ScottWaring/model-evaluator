import { MockApiService } from "./mock-api-service";
const { pipe } = require('rxjs/Operators');

document.addEventListener("DOMContentLoaded", initListeners)

function initListeners() {
    document.getElementById('id-input')
    document.getElementById('year-input')
    document.getElementById('get-button')

}

function getValuation(id, year) {
    const equipment = MockApiService.getData(id);
    equipment.pipe((res) => {

    });
}