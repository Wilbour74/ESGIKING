import mongoose from 'mongoose';
import { Product } from '../models/product.interface';
import { openConnection, getRequiredEnvVar } from '../services';
import { config } from 'dotenv';
import productsData from '../data/products.json';

config();

let products = productsData;

async function seedProducts() {
    const connection = await openConnection();
    const ProductModel = connection.model<Product>('Product', new mongoose.Schema({
        name: String,
        price: Number,
        type: String,
        category: String,
    }));
    
    try{
        await ProductModel.deleteMany({});
        await ProductModel.insertMany(products);
        console.log('Products seeded successfully');
    } catch (error) {
        console.error('Error seeding products:', error);
    }
}

seedProducts()