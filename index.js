// const colors = require('colors');
import colors from 'colors';

const interval = process.argv.slice(2);
const number1 = Number(parseInt(interval[0], 10));
const number2 = Number(parseInt(interval[1], 10));
const simpleList = [];
if((number1 > number2) || (isNaN(number1)) || (isNaN(number2))) {
    console.log(colors.red("Неверный интервал"));
    
}
if((number2 < 2) && (number1 < number2)) {
    console.log(colors.red('В диапазоне отсутствуют простые числа'));
}
if((number2 >= 2) && (!isNaN(number1)) && (number1 < number2)) {
    nextPrime:
    for(let i = 2; i <= number2; i++) {
        for(let j = 2; j < i; j++) {
            if(i%j === 0) continue nextPrime; 
        }
        simpleList.push(i); 
    }
    let q=0;
    for(let k = 0; k < simpleList.length; k++) {
        if(q === 0){
            console.log(colors.red(simpleList[k]));
        }
        if(q === 1){
            console.log(colors.yellow(simpleList[k]));
        }
        if(q === 2){
            console.log(colors.green(simpleList[k]));
        }
        q++;
        if(q===3) q=0;
       
    }
}


