let mealNames = ['X-tra Long Chili Cheese', 'Crispy Chicken', 'Sweet Chicken', 'Hot Chili Lover Beef Menü', 'Dinner for 2 Bundle', 'Breakfirst for 2 Bundle'];
let mealPrices = [5.99, 4.99, 4.99, 9.99, 14.99, 14.99]

let basketMealName = [];
let basketMealPrice = [];
let basketAmount = [];

function addToBasket(i) {
    if (mealIsSelected(i)) {
        let basketMealNamePosition = basketMealName.indexOf(mealNames[i]); //importing this in function addOne() is not avalable because
        basketAmount[basketMealNamePosition]++; //button + in basket_container and button +  in meal_container can't have function addOne() together.
        showToBasket();
    } else {
        addToBasketArray(i);
        showToBasket();
    }
}

function mealIsSelected(i) {
    return basketMealName.includes(mealNames[i]); // Wird true oder false
}

function addOne(i) {
    basketAmount[i]++;
}

function addToBasketArray(i) {
    basketMealName.push(mealNames[i]);
    basketMealPrice.push(mealPrices[i]);
    basketAmount.push(1);
}

function showToBasket() {
    document.getElementById('generateBasketMeals', 'sumCalc').innerHTML = ``;
    let sum = 0;
    for (let i = 0; i < basketMealName.length; i++) {
        let priceXAmount = basketMealPrice[i] * basketAmount[i] ;
        sum += priceXAmount;
        document.getElementById('generateBasketMeals').innerHTML += generateBasketMeals(i, priceXAmount); //without priceXAmount here the function doesnt work
    }
    sumCalc(sum);
    toggleCantOrderWarning(sum);
}

function generateBasketMeals(basketIndex, priceXAmount) { //without priceXAmount here the function doesnt work
    // if (priceXAmount > 0) { //this if-else is to toggle Reminding "make es voll", but doesnt work
        return `
                <div id="meal(${basketIndex})">
                    <span class="basketMealAmount">${basketAmount[basketIndex]}x</span>
                    <span class="basketMealName">${basketMealName[basketIndex]}</span>
                    <div class="basketEditButtons">
                        <button onclick="subtractOne(${basketIndex}), showToBasket()">–</button>
                        <button onclick="addOne(${basketIndex}), showToBasket()">+</button>
                        <button ><i class="fas fa-pen"></i></button>
                    </div>
                    <span class="basketMealPrice">${priceXAmount.toFixed(2).replace('.',',')}€</span>
                    <button onclick="deleteFromBasket(${basketIndex}), showToBasket()"><i class="far fa-trash-alt"></i></button>
                </div>
            `;
    // } else {
    //     return `
    //         <i class="fas fa-shopping-basket" style="font-size:5em;color:lightgray;"></i>
    //         <p>Mach es voll</p>
    //     `;
    // }
}

function sumCalc(sum) {
    document.getElementById('sum').innerHTML = `<b>${sum.toFixed(2).replace('.',',')}€</b>`;
    let deliveryCost;
    if(sum == 0){
        deliveryCost = 0;
    }else{
        deliveryCost = 5;
    }
    document.getElementById('deliveryCost').innerHTML = `${deliveryCost}€`;
    document.getElementById('totalSum').innerHTML = `<b>${(sum + deliveryCost).toFixed(2).replace('.',',')}€</b>`;
    document.getElementById('totalSumExtra').innerHTML = `<b>(${(sum + deliveryCost).toFixed(2).replace('.',',')}€)</b>`;
}

function toggleCantOrderWarning(sum){
    if(sum >= 14){
        document.getElementById('cantOrderWarning').classList.add('d-none');
        document.getElementById('orderButton').classList.remove('d-none');
    }else{
        document.getElementById('cantOrderWarning').classList.remove('d-none');
        document.getElementById('orderButton').classList.add('d-none');
    }
}

function subtractOne(i) {
    if(basketAmount[i] > 1){
        basketAmount[i]--;
    }
    else{
        deleteFromBasket(i)
    }
}

function deleteFromBasket(i, sum) {
    basketMealName.splice(i, 1);
    basketMealPrice.splice(i, 1);
    basketAmount.splice(i, 1);
}

function basketFullDisplay(){
    document.getElementById('basket_container_bar').className = 'invisible';
    document.getElementById('basket_container').style.display ='block';
    document.getElementById('closeBasketButton').style.display ='block';
    document.getElementById('basket_container').style.width ='100%';
    document.getElementById('main_content').style.display ='none';
    document.getElementById('footer').style.display ='none';
}
function closeBasket(){
    document.getElementById('basket_container_bar').classList.replace('invisible','visible');
    document.getElementById('basket_container').style.display ='none';
    document.getElementById('closeBasketButton').style.display ='none';
    document.getElementById('main_content').style.display ='block';
    document.getElementById('main_content').style.width ='100%';
    document.getElementById('footer').style.display ='block';
}

function order() { }