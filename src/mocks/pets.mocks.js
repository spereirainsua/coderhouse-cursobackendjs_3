import { fakerES_MX as fa } from "@faker-js/faker";

const generatePet = () => {
    const name = fa.animal.petName()
    const type = fa.helpers.arrayElement(['cat', 'dog']);
    const specie = fa.animal[type]()
    const birthDate = fa.date.birthdate({ mode: 'age', min: 1, max: 15 })
    const adopted = false
    const image = fa.image.urlLoremFlickr({ category: 'pets' })
    return {
        name,
        specie,
        birthDate,
        adopted,
        image
    }
}

export default generatePet