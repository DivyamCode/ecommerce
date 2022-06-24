const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncEror = require("../utils/catchAsyncEror");
const ApiFeature = require("../utils/apifeatures");

//create product

exports.createProduct= catchAsyncEror( async(req,res,next)=>{
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
 
    // console.log(req.body.email);
    // const Registeruser = new Product({
    //     name:req.body.email,
    //     description:req.body.des,
    //     price:req.body.price,
    //     rating:req.body.rating,
    //     images:{
    //         public_id:req.body.pr_id,
    //         url:req.body.img_url

    //     },
    //     category:req.body.category,
    //     stock:req.body.stock,
    //     numofReview:req.body.nor,
    //     review:{
    //         name:req.body.r_name,
    //         rating:req.body.r_rating,
    //         comment:req.body.comment
    //     },
              
    //     created_at :Date(),
    // })
    // const Registered =  Registeruser.save();
})

/// Getting all products
exports.getAllProducts =catchAsyncEror(
    async(req,res)=>{

       const apifeatures = new ApiFeature(Product.find(),req.query.keyword).search();


        //this function get all documnets__model must define_asusual
        const products = await apifeatures.query;
    
    
        res.status(200).json({
            success:true,
            products
        });
    
    }

) 

//Update product --admin

exports.updateProduct =catchAsyncEror(
    async (req,res,next)=>{
        let product = Product.findById(req.params.id);
    
        if(!product){
            return res.status(500).json({
                success:false,
                message:"product not found"
           })      
        }
        product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,runValidators:true,
            useFindAndModify:false
        })
    
        res.status(200).json({
            success:true,
            product
        })
    }
) 

    

exports.deleteProduct =catchAsyncEror(
    async (req,res,next)=>{
        const product = await Product.findById(req.params.id);
    
        if(!product){
            return res.status(500).json({
                success:false,
                message:"Product does not found"
            })
        }
        await product.remove();
        res.status(200).json({
            success:true,
            message:"Product is removed"
        })
    }
) ;

exports.getProductdetail =catchAsyncEror(
    async(req,res,next)=>{
        const product = await Product.findById(req.params.id);
    
        if(!product){
            return next(new ErrorHandler("Product not found",404));
            
        }
        
        res.status(200).json({
            success:true,
            product
        })       
    }
) 

  

