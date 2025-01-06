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
const addExpense = (description,amount) => {
    if(description === undefined && amount === undefined){
        console.log('neither description nor amount was provided, use add help to get more info');
        return;
    }else if(description === undefined){
        console.log('description was not provided, use add help to get more info');
        return;
    }else if(amount === undefined){
        console.log('amount was not provided, use add help to get more info');
        return;
    }
    const expenses = readExpenses();
    const id = expenses.length ? expenses[expenses.length-1].id + 1 : 1;
    const currentDate = new Date();
    const newExpense = {
        id,
        description,
        amount:Number(amount),
        date:`${currentDate.getFullYear()}-${formatStringNumber(currentDate.getMonth()+1)}-${formatStringNumber(currentDate.getDate())}`,
    }
    expenses.push(newExpense);
    writeExpenses(expenses);
    console.log(`Expense added successfully (ID:${id})`);
}

// list expenses
const listExpenses = () => {
    const expenses = readExpenses();
    console.log('#-ID-Date-------Description-------Amount');
    expenses.forEach(expense => {
        console.log(
            `# ${formatStringNumber(expense.id)} ${expense.date} "${expense.description}" ${expense.amount}`
        );
    });
}

// CLI handler
const main = () => {

    program.command('add')
    .description('add new expense with description and ammount')
    .requiredOption('--description <string>', 'description of the new expense')
    .requiredOption('--amount <price>', 'amount of the new expense')
    .action((options, state,command) => {
        addExpense(options.description,options.amount);
    });

    program.command('list')
    .description('list the recorded expenses in the cmd')
    .action(()=>{
        listExpenses();
    });

    program.parse();
    
}

main();