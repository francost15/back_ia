import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import { PORT } from './config.js'

import { DB_HOST,DB_DATABASE, DB_PORT } from './config.js'
//
import rutasProducts from './Routes/Products.routes.js'

const conexion = 'mongodb://' + DB_HOST + ':' + DB_PORT + '/' + DB_DATABASE
mongoose.connect(conexion).then()

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public')) //Con esta linea de codigo podemos visualizar imagenes
//app.get('/', (req,res) => { res.send('Hello word')})
app.use(rutasProducts)



//paraque no aparesca can't get /

app.use( (req,res) => {
    res.status(404).json({status:false, errors: 'Not FOUND'})
})

export default app
