import { fakerES_MX as fa } from "@faker-js/faker";
import bcrypt from 'bcrypt';

const generateUser = () => {
    const first_name = fa.person.firstName()
    const last_name = fa.person.lastName()
    const email = fa.internet.email({ firstName: first_name, lastName: last_name })
    const password = bcrypt.hashSync("coder123", 10)
    const role = fa.helpers.arrayElement(["user", "admin"])
    const pets = []
    return {
        first_name,
        last_name,
        email,
        password,
        role,
        pets
    }
}

export default generateUser