export class User { 
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNo: string
    role: string

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        phoneNo: string,
        role: string
    ) {
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.password = password
        this.phoneNo = phoneNo
        this.role = role
    }

}