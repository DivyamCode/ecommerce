const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"]
    },
    description:{
        type:String,
        required:[true,"please enter product description"]
    },
    price:{
        type:String,
        required:[true,"please enter prodcut price"],
        maxLength:[7,"price cannot exceed 8 character"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,'please enter Product category']
    },
    stock:{
        type:String,
        required:[true,'please enter Product stock'],
        maxLength:[5,"stock cannot exceed 5 character"],
        default:1
    },

    numofReview:{
        type:Number,
        default:0
    },
    review:[{
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }

    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
    

})

module.exports = mongoose.model("Product",productSchema) ;