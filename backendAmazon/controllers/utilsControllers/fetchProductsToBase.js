import products from '../../models/arrayProducts';
import Products from '../../models/modelProduct';
import mongoose from 'mongoose';
import dotenv from 'dotenv'


async function fetchProducts(){
    try{
        await mongoose.connect(process.env.dbURL)
        console.log('Połączono z bazą danych');
        await Products.insertMany(products);
        console.log('Produkty zostały dodane');
        mongoose.connection.close();
    }catch(err){
        console.log("łączenie z bazą nie udane ", err)
    }
}

fetchProducts();