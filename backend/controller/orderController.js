const Order = require('../model/orderModel');
const Product = require('../model/productModel');

exports.neworder = async(req,res,next)=>{
    const {
        shippingInfo,
        orderItem,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice    
    } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItem,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now() ,
        user:req.user.id
    });
    res.status(201).json({
        success:true,
        order
    })

}

exports.getOrderbyId = async(req,res,next)=>{
    if(!(req.user.roll=="admin")){
        res.status(403).json({
            message:"Unauthorized route acces"
        })
    }
    const order = await Order.findById(req.params.id);
    if(!order){
        res.status(404).json({
            success:false,
            message:"Order was not found"
        })
    }
    res.status(200).json({
        success:true,
        order
    })
}

exports.getAllorderMe = async(req,res,next)=>{
    const order = await Order.find({user:req.user._id});
    if(!order){
        res.status(200).json({
            success:false,
            message:"you had not ordered anything"
        })
    }
    res.status(200).json({
        success:true,
        order

    })


}

exports.getAllorder = async(req,res,next)=>{
    if(!(req.user.roll=="admin")){
        res.status(403).json({
            message:"Unauthorized route acces"
        })
    }
    const orders = await Order.find();
    if(!orders){
        res.status(200).json({
            success:false,
            message:"there is no ordered "
        })
    }
    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
        success:true,
        totalAmount,
        order

    })
}

exports.updateOrder = async(req,res,next)=>{
    if(!(req.user.roll=="admin")){
        res.status(403).json({
            message:"Unauthorized route acces"
        })
    }
    const order = await Order.find(req.params.id);
    if(order.orderStatus=="Delivered"){
        res.status(404).json({
            success:true,
            message:"there is ordered deleivered"
        })
    }
    order.orderItem.forEach( async(order)=>{
        await updateStock(order.Product,order.quantity);
    });

    order.orderStatus = req.body.status;
    if(req.body.status=="Delivered"){
        order.deliveredAt = Date.now()
    }
    await order.save({validateBeforeSave:false});


    res.status(200).json({
        success:true,
        totalAmount,
        order

    })
}

exports.deleteOrder = async(req,res,next)=>{
    if(!(req.user.roll=="admin")){
        res.status(403).json({
            message:"Unauthorized route acces"
        })
    }
    const order = await Order.find(req.params.id);
    if(!order){
        res.status(200).json({
            success:false,
            message:"there is no ordered "
        })
    }
    await order.remove();

    res.status(200).json({
        success:true,

    })
}

async function updateStock (id,quantity){
    const product = await Product.findById(id);

    product.stock-=quantity;

}