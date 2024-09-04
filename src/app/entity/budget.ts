export class Budget { 
    email: string
    category: string
    amount: number
    startDate: string
    endDate: string

    constructor(
        email: string,
        category: string,
        amount: number,
        startDate: string,
        endDate: string) {

        this.email = email
        this.category = category
        this.amount = amount
        this.startDate = startDate
        this.endDate = endDate
    }
}