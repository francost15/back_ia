import mongoose from "mongoose"
import * as fs from 'fs' //para manejar todos los archivos

const esquema = new mongoose.Schema({
    name:String, imagen:String, price:Number
},{ versionKey:false })

const ProductsModel = new mongoose.model('products', esquema)

//GET se utiliza para obtener datos de/los productos

export const getProducts = async (req,res) => {
    try{
        const {id} = req.params
        const rows = (id === undefined) ? await ProductsModel.find() : await ProductsModel.findById(id)
         return res.status(200).json({status:true, data:rows})
    }

    catch(error){
        return res.status(500).json({status:false, errors:[error]})
    }
}

//POST se utiliza para crear o actualizar datos en un Producto

export const saveProducts = async (req, res) => {
    try{
        const {name, price} = req.body
        const validation = validate(name, price, req.file, 'Y')
        if(validation == ''){
            const newProducts = new ProductsModel({
                name:name, price:price, imagen:'/uploads/' + req.file.filename
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

const validate = (name, imagen, price, validated) => {
    var errors = []
    if(name === undefined || name.trim() === ''){
        errors.push('El nombre ¡No! debe de estar vacio')
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

//PUT se utiliza para actualizar datos en un Producto/s

export const updateProducts = async (req, res) => {
    try{
        const {id} = req.params
        const {name, price} = req.body
        let imagen = ''
        let values = {name:name, price:price}
        if(req.file != null){
            imagen = '/uploads/' + req.file.filename
            values = {name:name, price:price, imagen:imagen}
            await deleteImagen(id)
        }
        const validation = validate(name, price)
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