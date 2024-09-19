export class Expense { 
    expenseId: number | null
    category: string
    amount: number
    date: string
    email: string

    constructor(expenseId: number, category: string, amount: number, date: string, email: string) {
        this.expenseId = expenseId
        this.category = category
        this.amount = amount
        this.date = date
        this.email = email
    }
}