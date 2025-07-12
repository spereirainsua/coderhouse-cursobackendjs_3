import generatePet from "../mocks/pets.mocks.js"
import generateUser from "../mocks/users.mocks.js"
import Pet from "../dao/Pets.dao.js"
import Users from "../dao/Users.dao.js"
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERROR } from "../utils/EErrors.js"

const mockingPets = async (req, res, next) => {
    try {
        let { cantidad = 1 } = req.query

        if (cantidad < 1) {
            CustomError.generateError(
                "Error al crear datos",
                "Error en parametros de cantidad",
                "Se ingresaron datos no validos para pets",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            )
        }

        let pets = []
        for (let i = 0; i < cantidad; i++) pets.push(generatePet())

        res.status(200).send({ pets })
    } catch (error) {
        next(error)
    }
}

const mockingUsers = async (req, res, next) => {
    try {
        let { cantidad = 1 } = req.query

        if (cantidad < 1) {
            CustomError.generateError(
                "Error al crear datos",
                "Error en parametros de cantidad",
                "Se ingresaron datos no validos para users",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            )
        }

        let users = []
        for (let i = 0; i < cantidad; i++) users.push(generateUser())

        res.status(200).send({ users })
    } catch (error) {
        next(error)
    }
}

const esNumeroValido = (valor) => {
    return valor !== undefined && valor !== null && valor !== '' && !isNaN(valor) && isFinite(Number(valor)) && valor >= 1;
}

const generateData = async (req, res, next) => {
    try {
        const { users, pets } = req.query

        const result = []
        if (users !== undefined && !esNumeroValido(users)) {
            CustomError.generateError(
                "Error al crear datos",
                "Error en parametros de cantidad",
                "Se ingresaron datos no validos para users",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            )
        } else if (users) {
            const userInst = new Users()
            for (let i = 0; i < users; i++) {
                const response = await userInst.save(generateUser())
                result.push(response)
            }
        }

        if (pets !== undefined && !esNumeroValido(pets)) {
            CustomError.generateError(
                "Error al crear datos",
                "Error en parametros de cantidad",
                "Se ingresaron datos no validos para pets",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            )
        } else if (pets) {
            const petInst = new Pet()
            for (let i = 0; i < pets; i++) {
                const response = await petInst.save(generatePet())
                result.push(response)
            }
        }

        res.status(201).send(result)
    } catch (error) {
        next(error)
    }
}

export default { mockingPets, mockingUsers, generateData }