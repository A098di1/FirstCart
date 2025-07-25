import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id:{type : String, required:true},
    name: {type : String, requird:true},
    email: {type: String, required:true, unique:true},
    imagurl :{type:object, default: {}},
    cartItems: { type: object, default: {}}
}, {minimize: false})

const User = mongoose.models.user || mongoose.model('user',userSchema)

export default User