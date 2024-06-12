import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import rutasProducts from './Routes/Products.routes.js'
import routesAuth from './Routes/Auth.routes.js'
import { URL, DB_HOST, DB_DATABASE, DB_PORT } from './config.js'
// import { DB_HOST, DB_USER, DB_PASS,DB_DATABASE, DB_PORT } from './config.js'
//const conexion = 'mongodb://' + DB_HOST + ':' + DB_PORT + '/' + DB_DATABASE
// const conexion = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

mongoose.connect(URL).then()

const app = express()
app.use(cors({ origin: '*' }));
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public')) //Con esta linea de codigo podemos visualizar imagenes
app.use(rutasProducts)
app.use(routesAuth)

//paraque no aparesca can't get /

app.use( (req,res) => {
    res.status(404).json({status:false, errors:error.message})
    console.log('Recurso no encontrado')
})


export default app
