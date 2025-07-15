import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import errorHandler from './middlewares/errorHandler.mid.js';
import cors from 'cors';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "Documentación APP Adoptme",
            description: "Documentación sobre la aplicación de adopción de mascotas.",
            version: "1.0.0"
        }
    },
    apis:["./src/docs/**/*.yaml"]
}

const docSpec = swaggerJSDoc(options)



const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect(`mongodb+srv://coder:coderpass@ecommerce-cluster.vjnwe.mongodb.net/adoptme_bk3?retryWrites=true&w=majority&appName=ecommerce-cluster`)

app.use(express.json());
app.use(cookieParser());

app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docSpec));
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);

app.use(errorHandler);

app.listen(PORT,()=>console.log(`Listening on ${PORT}`));
