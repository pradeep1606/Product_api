const Product = require("../models/product");

const getAllProducts = async (req, res) => {
    const { id, company,category, name, featured, sort, select } = req.query;
    const queryObject = {};
    if (id) { queryObject._id = id }  
    if (company) { queryObject.company = company }  
    if (category) { queryObject.category = category }
    if (featured) { queryObject.featured = featured }
    if (name) { queryObject.name = { $regex: name, $options: "p" } }

    let apiData = Product.find(queryObject);
    
    if (sort) {
        // let sortFix = sort.replace(",", " ");
        let sortFix = sort.split(",").join(" ");
        apiData = apiData.sort(sortFix)
    }
    if (select) {
        // let selectFix = select.replace(",", " ");
        let selectFix = select.split(",").join(" ");
        apiData = apiData.select(selectFix)
    }
    
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit);
    let skip = (page - 1) * limit;
    
    apiData = apiData.skip(skip).limit(limit);
    
    const Products = await apiData;
    // console.log(Products);
    res.status(200).json({ Products, nbHits: Products.length });
};

const getAllProductsTesting = async (req, res) => {
    const Products = await Product.find(req.query).select("name price");
    res.status(200).json({ Products });
};

module.exports = { getAllProducts, getAllProductsTesting }