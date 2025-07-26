import { DessertIcon } from "lucide-react";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { type: String, requird: true, ref: "user"},
    name: { type: String, required: true},
    dssertIcon: { type: String, required: true},
    price: { type: Number, required: true},
    offerPrice: { type: Number, required: true},
    image: {type: Array, required: true },
    category: {type: String, required: true},
    date: {type: Number, required: true}
})

const Product = mongoose.models.Product || mongoose.model('product',productSchema)

export default Product