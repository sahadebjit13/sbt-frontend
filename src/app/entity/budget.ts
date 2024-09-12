export class Budget { 

    id: number | null
    email: string
    category: string
    amount: number
    startDate: string
    endDate: string

    constructor(
        id: number,
        email: string,
        category: string,
        amount: number,
        startDate: string,
        endDate: string) {

        this.id = id
        this.email = email
        this.category = category
        this.amount = amount
        this.startDate = startDate
        this.endDate = endDate
    }
}