var express = require('express');
var Product = require('./../models/productModel');
var util = require('./../util');

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await Product.find({});
    res.send(products);
});

router.get("/:id", async (req, res) => {
    const products = await Product.findOne({_id: req.params.id});
    if(products){
        res.send(products);
    } else {
        res.status(404).send({message: "Product not found."})
    }
    
});

router.put("/:id", util.isAuth, util.isAdmin, async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product){
            product.name = req.body.name;
            product.price = req.body.price;
            product.image = req.body.image;
            product.brand = req.body.brand;
            product.category = req.body.category;
            product.countInStock = req.body.countInStock;
            product.description = req.body.description;
            const updatedProduct = await product.save();
            if (updatedProduct) {
                return res.status(200).send({
            message: 'New Product Updated',
            data: updatedProduct
            });
            }
    }
    return res.status(500).send({message: 'Error in Updating Product.'});  

});

router.delete("/:id", util.isAuth, util.isAdmin, async (req, res) => {
    const deletedProduct = await Product.findById(req.params.id);
    if (deletedProduct) {
        await deletedProduct.remove();
        res.send({ message: "Product Deleted" });
    } else {
        res.send("Error in Deletion.");
    }
});

router.post("/", util.isAuth, util.isAdmin, async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        brand: req.body.brand,
        category: req.body.category,
        countInStock: req.body.countInStock,
        description: req.body.description,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
    });
    const newProduct = await product.save();
    if (newProduct) {
        return res.status(201).send({
            message: 'New Product Created',
            data: newProduct
        });
    }
    return res.status(500).send({message: 'Error in Creating Product.'});
});




module.exports = router;