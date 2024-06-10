import mongoose from "mongoose"
import * as fs from 'fs' //para manejar todos los archivos

const esquema = new mongoose.Schema({
    nombre:String, descripcion:String, precio:Number, cantidad:Number,tipo:String,marca:String,imagen:String
},{ versionKey:false })
const ProductsModel = new mongoose.model('products', esquema)
//GET se utiliza para obtener datos de/los productos
export const getProducts = async (req,res) => {
    try{
        const {id} = req.params
        const rows= (id === undefined) ? await ProductsModel.find() : await ProductsModel.findById(id)
        return res.status(200).json({status:true, data:rows})
    }

    catch(error){
        return res.status(500).json({status:false, errors:[error]})
    }
}
//POST se utiliza para crear o actualizar datos en un Producto
export const saveProducts = async (req, res) => {
    try{
        const {nombre,descripcion,precio,cantidad,tipo, marca} = req.body
        const validation = validate(nombre,descripcion,precio,cantidad,tipo,marca, req.file, 'Y')
        if(validation == ''){
            const newProducts = new ProductsModel({
                nombre:nombre, price:price, type:type, ml:ml, imagen:'/uploads/' + req.file.filename
            })
            return await newProducts.save().then(
                () => { res.status(200).json({status:true, message:'Producto Guardado'}) }
            )
        }
        else{
            return res.status(400).json({status:false, errors:validation})
        }
    }
    catch(error){
        return res.status(500).json({status:false, errors:[error.message]})
    }
}
const validate = (nombre,descripcion,precio,cantidad,tipo, marca,validated) => {
    var errors = []
    if(nombre === undefined || name.trim() === ''){
        errors.push('El nombre ¡No! debe de estar vacio')
    }
    if(descripcion === undefined || descripcion.trim() === ''){
        errors.push('La descripcion debe de estar vacio')
        }
    if(precio === undefined || price.trim() === '' || isNaN(precio)){
        errors.push('El precio ¡No! debe de estar vacio')
    }
    if(cantidad === undefined || cantidad.trim() === '' || isNaN(cantidad)){
        errors.push('La cantidad debe de estar vacio')
    }
    if(tipo === undefined || tipo.trim() === ''){
        errors.push('El tipo ¡No! debe de estar vacio')
    }
    if(marca === undefined || marca.trim() === ''){
        errors.push('La marca debe de estar vacio')
    }
    if(validated === 'Y' && imagen === undefined){
        errors.push('Selecciona una imagen en formato jpg, jpeg o png')
    }
    else{
        if(errors != ''){
            fs.unlinkSync('./public/uploads/' + imagen.filename)
        }
    }
    return errors
}

//PUT se utiliza para actualizar datos en un Productos
export const updateProducts = async (req, res) => {
    try{
        const {id} = req.params
        const {nombre,descripcion,precio,cantidad,tipo,marca} = req.body
        let imagen = ''
        let values = {nombre:nombre, descripcion:descripcion,precio:precio,cantidad:cantidad,tipo:tipo,marca:marca}
        if(req.file != null){
            imagen = '/uploads/' + req.file.filename
            values = {nombre:nombre, descripcion:descripcion,precio:precio,cantidad:cantidad,tipo:tipo,marca:marca, imagen:imagen}
            await deleteImagen(id)
        }
        const validation = validate(nombre,descripcion,precio,cantidad,tipo,marca)
        if(validation == ''){
            await ProductsModel.updateOne({_id:id}, {$set: values})
            return  res.status(200).json({status:true, message:'Producto Actualizado'})
        }
        else{
            return res.status(400).json({status:false, errors:validation})
        }
    }

    catch(error){
        return res.status(500).json({status:false, errors:[error.message]})
    }
}

//DELETE se utiliza para eliminar un Producto/s
export const deleteProducts = async(req, res) => {
    try{
        const {id} = req.params
        await deleteImagen(id)
        await ProductsModel.deleteOne({_id:id})
        return res.status(200).json({status:true, message:'Producto Eliminado'})
    }
    catch(error){
        return res.status(500).json({status:false, errors:[error.message]})
    }
}

//DELETE se utiliza para eliminar un Imagene/s
const deleteImagen = async(id) => {
    const product = await ProductsModel.findById(id)
    const imagen = product.imagen
    fs.unlinkSync('./public/' + imagen)
}