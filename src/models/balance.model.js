class Balance {
    labels = [];
    income = [];
    expenses = [];

    constructor(labels, income, expenses) {
        this.labels = labels;
        this.income = income;
        this.expenses = expenses;
    }
}

module.exports = Balance;