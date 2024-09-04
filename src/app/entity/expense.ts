export class Expense { 
    expenseId: number
    category: string
    amount: number
    date: string

    constructor(expenseId: number, category: string, amount: number, date: string) {
        this.expenseId = expenseId
        this.category = category
        this.amount = amount
        this.date = date
    }
}