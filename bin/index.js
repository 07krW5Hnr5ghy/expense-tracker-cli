#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {Command} = require('commander');
const program = new Command();

// expenses file route
const JSON_FILE = path.resolve(process.cwd(),'expenses.json');

// helper functions
const readExpenses = () => {
    if(!fs.existsSync(JSON_FILE)){
        return[];
    }
    const data = fs.readFileSync(JSON_FILE,'utf-8');
    return JSON.parse(data||'[]');
}
const writeExpenses = (expenses) => {
    fs.writeFileSync(JSON_FILE,JSON.stringify(expenses,null,2),'utf-8');
}
const formatStringNumber = (number) => {
    return number < 10 ? String("0"+number) : number;
}

// expenses functions
const addExpense = (description,amount,category) => {
    if(typeof(Number(amount))!=="number"){
        console.log(`Expense amount must be a number`);
        return;
    }
    const expenses = readExpenses();
    const id = expenses.length ? expenses[expenses.length-1].id + 1 : 1;
    const currentDate = new Date();
    const newExpense = {
        id,
        description,
        category,
        amount:Number(amount),
        date:`${currentDate.getFullYear()}-${formatStringNumber(currentDate.getMonth()+1)}-${formatStringNumber(currentDate.getDate())}`,
    }
    expenses.push(newExpense);
    writeExpenses(expenses);
    console.log(`Expense added successfully (ID:${id})`);
}

const listExpenses = () => {
    const expenses = readExpenses();
    console.log('#-ID-Date-------Amount-------Description');
    expenses.forEach(expense => {
        console.log(
            `# ${formatStringNumber(expense.id)} ${expense.date} $${expense.amount} "${expense.description}"`
        );
    });
    
}

const summaryExpenses = (month,category) => {
    if(typeof(Number(month))!=="number"){
        console.log(`Expense month must be a number`);
        return;
    }
    const expenses =  readExpenses();
    let summaryExpenses = null;
    const currentDate = new Date();
    if(month!==undefined&&category!==undefined){
        summaryExpenses = expenses.reduce((accumulator,currentValue) => {
            if(
                parseInt(currentValue.date.slice(5,7),10)===parseInt(month,10) &&
                parseInt(currentValue.date.slice(0,5),10)===currentDate.getFullYear() &&
                currentValue.category === category
            ){
                return accumulator+currentValue.amount;
            }else{
                return accumulator;
            }
        },0);
    }else if(month!==undefined){
        summaryExpenses = expenses.reduce((accumulator,currentValue) => {
            if(
                parseInt(currentValue.date.slice(5,7),10)===parseInt(month,10) &&
                parseInt(currentValue.date.slice(0,5),10)===currentDate.getFullYear()
            ){
                return accumulator+currentValue.amount;
            }else{
                return accumulator;
            }
        },0);
    }else if(category!==undefined){
        summaryExpenses = expenses.reduce((accumulator,currentValue) => {
            if(
                currentValue.category === category
            ){
                return accumulator+currentValue.amount;
            }else{
                return accumulator;
            }
        },0);
    }else{
        summaryExpenses = expenses.reduce(
            (accumulator,currentValue) => accumulator+currentValue.amount,
            0
        );
    }
    console.log(`# Total expenses: $${Math.round((summaryExpenses+Number.EPSILON)*100)/100}`);
}

const deleteExpense = (id) => {
    const expenses = readExpenses();
    const updatedExpenses = expenses.filter((expense)=> expense.id!==parseInt(id,10));
    if(expenses.length===updatedExpenses.length){
        console.log(`Expenses with ID ${id} not found.`);
        return;
    }
    writeExpenses(updatedExpenses);
    console.log(`Expense with ID ${id} deleted successfully.`);
}

// CLI handler
const main = () => {

    program.command('add')
    .description('add new expense with description and ammount')
    .requiredOption('--description <string>', 'description of the new expense')
    .requiredOption('--amount <price>', 'amount of the new expense')
    .requiredOption('--category <string>','category of the expense')
    .action((options) => {
        addExpense(options.description,options.amount,options.category);
    });

    program.command('list')
    .description('list the recorded expenses in the cmd')
    .action(()=>{
        listExpenses();
    });

    program.command('summary')
    .description('list the summary of the expenses')
    .option('--month <number>','filter expenses by month number of the current year')
    .option('--category <string>')
    .action((options)=>{
        summaryExpenses(options.month,options.category);
    });

    program.command('delete')
    .description('delete one of the expenses')
    .requiredOption('--id <number>','id of the expense to delete')
    .action((options)=>{
        deleteExpense(options.id);
    })

    program.parse();
    
}

main();