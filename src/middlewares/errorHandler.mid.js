import fs from 'fs'

const pathLog = "./src/logs/error.log"

const errorHandler = (error, req, res, next) => {
    if (fs.existsSync(pathLog)) {
        fs.appendFileSync(pathLog, `\nFecha: ${ new Date() } - ${ error.name } - ${ error.message } - ${ error.cause } - ${ req.method } - ${ req.url }`)
    } else {
        fs.writeFileSync(pathLog, `Fecha: ${ new Date() } - ${ error.name } - ${ error.message } - ${ error.cause } - ${ req.method } - ${ req.url }`)
    }

    res.setHeader('Content-Type', 'application/json')
    if (error.custom) {
        res.status(error.code).json({
            name: error.name,
            message: error.message,
            cause: error.cause,
            method: req.method,
            url: req.url
        })
    } else {
        res.status(500).json({
            name: "Error",
            message: "Internal Server Error",
            method: req.method,
            url: req.url
        })
    }
}
export default errorHandler