const calculatorDisplay = document.querySelector('h1'); //h1 element
const inputBtns = document.querySelectorAll('button'); //all buttons
const clearBtn = document.getElementById('clear-btn');

let firstValue = 0;
let operatorValue = '';
let awaitingNextValue = false;

const sendNumberValue = (number)=>{
    //replace current display value if first value is entered
    if(awaitingNextValue){
        calculatorDisplay.textContent = number;
        awaitingNextValue = false;
    }else{
        const displayValue = calculatorDisplay.textContent;
        calculatorDisplay.textContent = displayValue === '0' ? number : displayValue + number;
    }
}

const addDecimal = ()=>{
    //if operator pressed, don't add decimal
    if(awaitingNextValue) return;
    //if no decimal, add one:
    if(!calculatorDisplay.textContent.includes('.')){
        calculatorDisplay.textContent  = `${calculatorDisplay.textContent}.`;
    }
}

//Calculate first and second values depending on operator
const calculate = {
    '/': (firstNumber, secondNumber) => firstNumber / secondNumber,

    '*': (firstNumber, secondNumber) => firstNumber * secondNumber,

    '+': (firstNumber, secondNumber) => firstNumber + secondNumber,

    '-': (firstNumber, secondNumber) => firstNumber - secondNumber,

    '=': (firstNumber, secondNumber) => secondNumber,
}

const useOperator = (operator) =>{
    //Number object: Number(value) converts string or other value to number type
    const currentValue = Number(calculatorDisplay.textContent);

    //to prevent multiple operators:
    if(operatorValue && awaitingNextValue) {
        operatorValue = operator;
        return;
    }

    //assign first value if no value 
    if(!firstValue) {
        firstValue = currentValue;
    }else{
        //console.log(firstValue, operatorValue, currentValue)
        const calculation = calculate[operatorValue](firstValue, currentValue);
        calculatorDisplay.textContent = calculation;
        firstValue = calculation;
    }
    //ready for next value, store operator
    awaitingNextValue = true;
    operatorValue = operator; 
}

// Add Event Listeners for numbers, operators, and decimal buttons //
inputBtns.forEach((inputBtn) => {
    if(inputBtn.classList.length === 0){ // for number buttons bc no class assigned to it
        inputBtn.addEventListener('click', ()=> sendNumberValue(inputBtn.value)) //anonymous funciton calls the sendNum function
    }else if(inputBtn.classList.contains('operator')){
        inputBtn.addEventListener('click', ()=> useOperator(inputBtn.value)) 
    }else if(inputBtn.classList.contains('decimal')){
        inputBtn.addEventListener('click', ()=> addDecimal()) 
    }
});

//Reset all values, display
const resetAll = ()=>{
    firstValue = 0;
    operator = '';
    awaitingNextValue = false;
    calculatorDisplay.textContent = '0';
}

//Event Listener
clearBtn.addEventListener('click', resetAll);