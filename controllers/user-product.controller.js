const User = require('../models/user.model')

exports.findAll = async(req,res) => {
    console.log("Find all user's products");

    try{
        const results = await User.find({},{username:1, products:1})
        res.status(200).json({status:true,data:results});
        console.log("Success in reading all user's products");
    }catch (err){
        res.status(400).json({status:false,data:err});
        console.log("Problem in reading user's products");
    }
}

exports.findOne = async(req,res) => {
    const username = req.params.username;
    console.log("Find user's products with username ", username);

    try{
        const result = await User.findOne({username: username},{username: 1, products: 1});
        res.status(200).json({status:true, data: result});
        console.log("Success in reading user's products with username: ", username);
    }catch(err){
        res.status(400).json({status:false,data:err});
        console.log("Problem in reading user's products with username ", username);
    }
}

exports.addProduct = async(req,res) => {
    const username = req.body.username;
    const products = req.body.products;

    console.log("Insert product to username ", username);

    try{
        const result = await User.updateOne(
            {username: username},
            {
                $push: {
                    products: products
                }
            }
        );
        res.status(200).json({status:true, data:result});
        console.log("Added product to user with username ", username);
    }catch(err){
        res.status(400).json({status:false, data:err});
        console.log("Problem in saving product", username);
    }
}

exports.updateProduct = async(req,res) => {
    const username = req.params.username;
    const product_name = req.body.product_name;
    const product_quantity = req.body.product_quantity;

    console.log("Update product for username ", username);

    try{
        const result = await User.updateOne(
            {username: username, "products.product":product_name},
            {
                $set: {
                    "products.$.quantity":product_quantity
                }
            }
        );
        res.status(200).json({status:true, data:result});
        console.log("Success in updating product");
    }catch(err){
        res.status(400).json({status:false, data:err});
        console.log("Problem in update product");
    }
}

exports.deleteProduct = async(req, res) => {
    const username = req.params.username;
    const product = req.params.product;

    try{
        const result = await User.updateOne(
            {username:username},
            {
                $pull: {
                    products: { product: product}
                }
            }
        );

        console.log("Success in deleting product");
        res.status(200).json({status:true, data : result});
    }catch(err){
        console.log("Problem in deleting product");
        res.status(400).json({status:false, data:err});
    }
}


exports.stats1 = async(req, res) => {
    console.log("For all users sum by product and count");

    try {
        const results = await User.aggregate(
            [
                {
                    $unwind: "$products"
                },
                {
                    $project: {
                        id: 1,
                        username: 1,
                        products: 1
                    }
                },
                {
                    $group: {
                        _id: {
                            username: "$username",
                            product: "$products.product"
                        },
                        totalAmount:{
                            $sum: {
                                $multiply: ["$products.cost", "$products.quantity"]
                            }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]
        );
        res.status(200).json({status:true, data: results})
        console.log("Success in stats1");
    } catch (err) {
        res.status(400).json({status:false, data: err});
        console.log("Problem in stats1");
    }
}