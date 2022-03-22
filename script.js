
let meals = [];
let beliebteGerichte = [];
let specials = [];

let basket = [];

let currentMeal;

let sumCost;
let sumWithDeliveryCost;






// ==============================
// COMMON FUNCTIONS
// ==============================


/** 
 *  SYNTAX: array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
 *  Reduce a JSON to get only value of one name, and push in an array:
*/
function reduce(JSON) {
    let output = JSON.reduce((accumulator, currentValue) => {
        accumulator.push({ "name": currentValue.name });
        return accumulator;
    }, []);

    console.log('reduce', output)
}


/**
 * calculate sum of all the numbers in a numbers array.
 * @param {Array} arr arry contains the numbers to calc sum.
 */
function calcSum(arr) {
    return arr.reduce(function (a, b) {
        return a + b;
    }, 0);
}


/**
 * collect all same elements from an Array, push them in a new array.
 * @param {Array} array the array contains the elements that you want to collect.
 * @param {Function} keyName if the array is JSON, keyName is the name of the value that we filter out; if not, just let the Funktion (e)=>{return e}
 * @param {string} value the value of element that we filter out.
 */
function groupFromArray(array, keyName, value) {
    return array.filter(e => keyName(e).includes(value));
}


function setToLocalStorage(key, array) { //set here and use below
    localStorage.setItem(key, JSON.stringify(array));
}


function getFromLocalStorage(key) { //set here and use below
    return JSON.parse(localStorage.getItem(key));
}


// ==============================
// COMMON FUNCTIONS
// ==============================














/**
 * fetching all meals from JSON file to the array meals here.
 */
async function getMealsFromJsonFile() {
    
    if (!getFromLocalStorage('meals')) {
        let response = await fetch('./meals.json');
        let responseAsJSON = await response.json();
        meals = responseAsJSON;
    }
    else {
        meals = getFromLocalStorage('meals');
    }
}


async function renderMeals() {
    await getMealsFromJsonFile();

    separateMeals(meals);

    updateBasket();
}


function separateMeals(meals) {
    beliebteGerichte = groupFromArray(meals, (e) => { return e.categories }, 'Beliebte Gerichte');
    renderSeparatedMeals(beliebteGerichte, 'beliebteGerichte');

    specials = groupFromArray(meals, (e) => { return e.categories }, 'Specials');
    renderSeparatedMeals(specials, 'specials');
}


function renderSeparatedMeals(group, id) {
    document.getElementById(id).innerHTML = ``;
    for (let i = 0; i < group.length; i++) {
        const meal = group[i];

        document.getElementById(id).innerHTML += `
            <div class="position-relative border rounded p-3 mt-3 d-flex">
                <button class="btn btn-sm btn-outline-primary position-absolute top-0 end-0" onclick="addOne(${meal.id})">+</button>
                <div class="card-body">
                    <h5 class="card-title">${meal.name}</h2>
                    <h2 class="card-text text-warning">${germanNrFormat(meal.price)}€</h2>
                </div>
                <div class="meal_img_container">
                    <img src=${meal.imgUrl}>
                </div>
            </div>
        `
    }
}


function updateBasket() {
    basket = meals.filter(meal => meal.inBasket > 0);
    renderBasketMeals();
    updateSumCost();
    setToLocalStorage('meals', meals);
}


function findCurrentMeal(mealID) {
    meals.forEach(meal => {
        if (meal.id === mealID) {
            currentMeal = meal;
            return;
        }
    });
}


function addOne(mealID) {
    findCurrentMeal(mealID);
    currentMeal.inBasket++;
    updateBasket();
}


function subtractOne(mealID) {
    findCurrentMeal(mealID);
    currentMeal.inBasket--;
    updateBasket();
}


function deleteFromBasket(mealID) {
    findCurrentMeal(mealID);
    currentMeal.inBasket = 0;
    updateBasket();
}


function updateSumCost() {
    let costArray = [];
    basket.forEach(meal => { costArray.push(meal.price * meal.inBasket) });
    sumCost = calcSum(costArray);

    renderCost();
    warnOrderability();
}


function renderBasketMeals() {
    if (basket.length == 0) {
        emptyBasket()
    } else {
        document.getElementById('basketMeals').innerHTML = ``;

        basket.forEach(meal => {
            document.getElementById('basketMeals').innerHTML += `
                <div id="meal(${meal.id})">
                    <span class="basketMealAmount">${meal.inBasket}x</span>
                    <span class="basketMealName">${meal.name}</span>
                    <div class="basketEditButtons">
                        <button class="btn btn-outline-primary  btn-sm m-1" onclick="subtractOne(${meal.id})">–</button>
                        <button class="btn btn-outline-primary  btn-sm m-1" onclick="addOne(${meal.id})">+</button>
                    </div>
                    <span class="basketMealPrice">${germanNrFormat(meal.price * meal.inBasket)}€</span>
                    <button class="btn btn-outline-primary btn-sm m-1" onclick="deleteFromBasket(${meal.id})"><i class="far fa-trash-alt"></i></button>
                </div>
            `;
        });
    }
}


function emptyBasket() {
    document.getElementById('basketMeals').innerHTML = `
        <i class="fas fa-shopping-basket" style="font-size:5em;color:lightgray;"></i>
        <p>Mach es voll</p>
    `;
}


function germanNrFormat(number) {
    return number.toFixed(2).replace('.', ',')
}


function renderCost() {
    let deliveryCost;
    if (sumCost == 0) {
        deliveryCost = 0;
    } else {
        deliveryCost = 5;
    }

    document.getElementById('sumCalc').innerHTML = `
        <div>
            <span><b>Zwischensumme</b></span> <span id="sum"><b>${sumCost}€</b></span>
        </div>
        <div>
            <span>Lieferkosten</span> <span id="deliveryCost">${deliveryCost}€</span>
        </div>
        <div>
            <span><b>Gesamt</b></span> <span id="totalSum"><b>${germanNrFormat(sumCost + deliveryCost)}€</b></span>
        </div>
    `;
    document.getElementById('totalSumExtra').innerHTML = `(${germanNrFormat(sumCost + deliveryCost)}€)`;
}


function warnOrderability() {
    if (sumCost >= 14) {
        document.getElementById('cantOrderWarning').classList.add('d-none');
        document.getElementById('orderButton').classList.remove('d-none');
    } else {
        document.getElementById('cantOrderWarning').classList.remove('d-none');
        document.getElementById('orderButton').classList.add('d-none');
    }
}


function basketFullDisplay() {
    document.getElementById('basket_container_bar').className = 'invisible';
    document.getElementById('basket_container').style.display = 'block';
    document.getElementById('closeBasketButton').style.display = 'block';
    document.getElementById('basket_container').style.width = '100%';
    document.getElementById('main_content').style.display = 'none';
    document.getElementById('footer').style.display = 'none';
}
function closeBasket() {
    document.getElementById('basket_container_bar').classList.replace('invisible', 'visible');
    document.getElementById('basket_container').style.display = 'none';
    document.getElementById('closeBasketButton').style.display = 'none';
    document.getElementById('main_content').style.display = 'block';
    document.getElementById('main_content').style.width = '100%';
    document.getElementById('footer').style.display = 'block';
}








function search(keyWord) {
    let search = meals.filter(meal => meal.name.includes(keyWord) || meal.price.toString().includes(keyWord));
    separateMeals(search);
}