export class CustomError {
    static generateError = (name, message, cause = "N/D", code = 500) => {
        let error = new Error(message, { cause })
        error.name = name
        error.code = code
        error.custom = true

        throw error
    }
}