
   

    const speak =()=>{
        console.log('5')
    }
    const $five = $("[value|='5']")
    $five.on('click', speak)


const calculator = {
    displayValue: '0',  //string value to represent input of user or result of operation
    firstOperand: null, //will store first operand
    waitingForSecondOperand: false, //serves as a way to check if both first operand and operator have been inputted
    //if ^^ true, the next numbers taht the user enters will constitute the second operand
    operator: null //will store operator for an expression
}

const inputDigit=(digit)=>{
    const { displayValue, waitingForSecondOperand } = calculator;
    if(waitingForSecondOperand === true){
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    }else{
        //overwrite 'displayValue' if the current value is '0' otherwise append to it
         calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    console.log(calculator)
}

const inputDecimal=(dot)=>{
    if(calculator.waitingForSecondOperand === true){
        calculator.displayValue = '0.'
        calculator.waitingForSecondOperand = false;
        return
    }

    //if displayValue does not contain a decimal point:
    if(!calculator.displayValue.includes(dot)){
        //append decimal point
        calculator.displayValue += dot;
    }
}

const handleOperator =(nextOperator)=>{
    //destructure the properties on the calc object
    const { firstOperand, displayValue, operator} = calculator;
    //'parseFloat converts the string contents of displayValue to a floating point number
    const inputValue = parseFloat(displayValue);

    if(operator && calculator.waitingForSecondOperand){
        calculator.operator = nextOperator;
        console.log(calculator)
        return
    }

    //verify firstOperand is null and that the inputValue is not a NaN value:
    if(firstOperand === null && !isNaN(inputValue)){
        //update the firstOperand property:
        calculator.firstOperand = inputValue;
    }else if(operator){
        const result = calculate(firstOperand, inputValue, operator)
        // calculator.displayValue = String(result)
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`
        calculator.firstOperand = result;
    }
    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    console.log(calculator)
}

const calculate=(firstOperand, secondOperand, operator)=>{
    if(operator === '+'){
        return firstOperand + secondOperand
    }else if(operator === '-'){
        return firstOperand - secondOperand
    }else if(operator === '*'){
        return firstOperand * secondOperand;
    }else if(operator === '/'){
        return firstOperand / secondOperand
    }
    return secondOperand
}


const resetCalculator=()=> {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    console.log(calculator);
  }


  //update the display:
const updateDisplay =()=>{
    //select element with calculator screen
    const $display = $('.calculator-screen')
    $display.value = calculator.displayValue;
}
updateDisplay();


const buttons = $('button')
buttons.on('click', ()=>{
    //access the clicked element
    //const {target} = event; //??? listening for a click event on the element with class calculator-keys
    // const target = event.target
    const {target} = event;
    const {value} = target;
    //target variable is an object that represents the element that you clicked - if element is not a button it will exit
    console.log(event)
    //check if the clicked element is a button, if not, exit form the function:
    // if(!target.matches('button')){
    //     return;
    // }
    let buttonType = this.value
    switch(buttonType){
        case '+': 
        case '-': 
        case '*':
        case '/':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default: //check if key is an integer:
            if(Number.isInteger(parseFloat(value))){
                console.log(value)
                inputDigit(value)
            }
    }
})
    updateDisplay();