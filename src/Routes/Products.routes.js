import { Router } from 'express'
import { getProducts, saveProducts, updateProducts, deleteProducts } from '../Controllers/ProductsController.js'
import {uploadImagen} from '../Middleware/Storage.js'
import {verifyToken} from "../Middleware/Auth.js";

const rutas = Router()

rutas.get('/api/products', getProducts)
rutas.get('/api/products/:id',getProducts)
rutas.post('/api/products', verifyToken, uploadImagen.single('imagen'), saveProducts)
rutas.put('/api/products/:id', verifyToken, uploadImagen.single('imagen'), updateProducts)
rutas.delete('/api/products/:id', verifyToken, deleteProducts)

export default rutas