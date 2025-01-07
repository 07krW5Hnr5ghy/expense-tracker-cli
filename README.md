# **Expense Tracker CLI**

A simple command-line interface (CLI) tool to record, list and delete expenses.

## **Features**

- Record expenses with date,description,amount and category.
- List the recorded expenses.
- Delete recorded expenses.
- Summarize recorded expenses by month and category.

## **Installation**

1. Clone the repository.

```bash
git clone https://github.com/07krW5Hnr5ghy/expense-tracker-cli
cd expense-tracker-cli
npm install -g .
```

## **Usage**

### **Manage Expenses**

#### ** add expense **

```bash
expense-tracker add --description "groceries" --category "food" --amount 3.45
```

#### ** list expenses **

```bash
expense-tracker list
```

#### ** summarize expenses **

```bash
expense-tracker summary --category "education" --month 2
```

#### ** delete expense **

```bash
expense-tracker delete --id 2
```

## **Development**

### **File Structure**

```
expense-tracker-cli/
├── bin/index.js   # Main CLI script
├── expenses.json   # Store recorded expenses
└── README.md     # Documentation
```

## project url

https://roadmap.sh/projects/expense-tracker
