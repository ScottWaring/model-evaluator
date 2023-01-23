'use strict';

const MockApiService = {
    data: {
        "67352": {
            "schedule": {
                "years": {
                    "2006": {
                        "marketRatio": 0.311276,
                        "auctionRatio": 0.181383
                    },
                    "2007": {
                        "marketRatio": 0.317628,
                        "auctionRatio": 0.185085
                    },
                    "2008": {
                        "marketRatio": 0.324111,
                        "auctionRatio": 0.188862
                    },
                    "2009": {
                        "marketRatio": 0.330725,
                        "auctionRatio": 0.192716
                    },
                    "2010": {
                        "marketRatio": 0.363179,
                        "auctionRatio": 0.198498
                    },
                    "2011": {
                        "marketRatio": 0.374074,
                        "auctionRatio": 0.206337
                    },
                    "2012": {
                        "marketRatio": 0.431321,
                        "auctionRatio": 0.213178
                    }
                },
                "defaultMarketRatio": 0.02,
                "defaultAuctionRatio": 0.02
            },
            "saleDetails": {
                "cost": 681252,
                "retailSaleCount": 122,
                "auctionSaleCount": 17
            },
            "classification": {
                "category": "Earthmoving Equipment",
                "subcategory": "Dozers",
                "make": "Caterpillar",
                "model": "D8T"
            }
        },
        "87390": {
            "schedule": {
                "years": {
                    "2016": {
                        "marketRatio": 0.613292,
                        "auctionRatio": 0.417468
                    },
                    "2017": {
                        "marketRatio": 0.692965,
                        "auctionRatio": 0.473205
                    },
                    "2018": {
                        "marketRatio": 0.980485,
                        "auctionRatio": 0.684991
                    },
                    "2019": {
                        "marketRatio": 1.041526,
                        "auctionRatio": 0.727636
                    },
                    "2020": {
                        "marketRatio": 1.106366,
                        "auctionRatio": 0.772935
                    }
                },
                "defaultMarketRatio": 0.06,
                "defaultAuctionRatio": 0.06
            },
            "saleDetails": {
                "cost": 48929,
                "retailSaleCount": 12,
                "auctionSaleCount": 127
            },
            "classification": {
                "category": "Aerial Equipment",
                "subcategory": "Boom Lifts",
                "make": "JLG",
                "model": "340AJ"
            }
        }
    },

    getData(id) {
        const data = this.data[id];
        const hasData = !!data;
        const response = {
            data,
            id: hasData ? id : null,
            status: hasData ? 200 : 400,
            message: hasData ? null : 'Model ID does not exist, try different ID'
        }
        return new Promise((resolve, reject) => {
            return hasData ? resolve(response) : reject(response);
        });
    }
}

let id,
    year,
    idInput,
    yearInput,
    getButton,
    marketValue,
    auctionValue,
    errorMessage;

document.addEventListener("DOMContentLoaded", getElements)

function getElements() {
    idInput = document.getElementById('id-input');
    yearInput = document.getElementById('year-input');
    getButton = document.getElementById('get-button');
    marketValue = document.getElementById('market-value');
    auctionValue = document.getElementById('auction-value');
    errorMessage = document.getElementById('error-message');
    getButton.toggleAttribute('disabled', true);
    initListeners();
    runTestLoggingFunctions();
}

function initListeners() {
    idInput.addEventListener('change', () => inputChange());
    yearInput.addEventListener('change', () => inputChange());
    getButton.addEventListener('click', () => getValuation(id, year))
}

function inputChange() {
    year = yearInput.value;
    id = idInput.value
    if (id > 0 && year > 1899) {
        getButton.toggleAttribute('disabled', false);
    } else {
        getButton.toggleAttribute('disabled', true);

    }
}

function getValuation(modelId, modelYear) {
    clearValueState();
    clearErrorState();
    return MockApiService.getData(modelId).then((res) => {
        if (res.status === 200) {
            return handleResponse(res.data, modelYear);
        }
    }).catch((res) => {
        handleError(res.message);
        return res;
    });
}

function handleResponse(responseData, modelYear) {
    const salesRatios = responseData.schedule.years[modelYear];
    const hasSalesRations = !!salesRatios;
    let message;
    let data;

    if (!hasSalesRations) {
        message = handleInvalidYear(responseData);
    } else {
        const valueMarket = parseFloat((responseData.saleDetails.cost * salesRatios.marketRatio).toFixed(2));
        const valueAuction = parseFloat((responseData.saleDetails.cost * salesRatios.auctionRatio).toFixed(2));
        marketValue.innerText = valueMarket;
        auctionValue.innerText = valueAuction;
        data = {marketValue: valueMarket, auctionValue: valueAuction}
    }

    return {data: data, message: message};
}


function handleInvalidYear(data) {
    const years = Object.keys(data?.schedule.years)
    const message = `Year selected is invalid, please select one of the following years: ${years.join(', ')}`
    yearInput.classList.add('has-error');
    setErrorMessage(message);
    return message;
}

function handleError(message) {
    console.error(message);
    idInput.classList.add('has-error');
    setErrorMessage(message);
}

function setErrorMessage(message) {
    errorMessage.classList.add('has-error');
    errorMessage.innerText = message;
}

function clearErrorMessage() {
    errorMessage.classList.remove('has-error');
    errorMessage.innerText = '';
}

function clearErrorState() {
    clearErrorMessage();
    idInput.classList.remove('has-error');
    yearInput.classList.remove('has-error');
}

function clearValueState() {
    marketValue.innerText = '';
    auctionValue.innerText = '';
}


// Test and Log Function
function runTestLoggingFunctions() {
    getValuation(67352, 2007).then((res) => {
        console.log('Get Model Valuation | ID : 67352 | Year: 2007 :: ', res);
    })
    getValuation(67352, 1900).then((res) => {
        console.log('Get Model Valuation | ID : 67352 | Year: 1900 :: ', res);
    })
    getValuation(87964, 2011).then((res) => {
        console.log('Get Model Valuation | ID : 87964 | Year: 2011 :: ', res);
    });
}
