const productModel = require("../models/ProductModel")


const insert = (data) => {
    const newProduct = new productModel(data)

    return newProduct.save()
}


const getData = () => {
    return productModel.find({})
}

const search = (filter) => {
    return productModel.find({"Trendyol.name": {"$regex": filter, "$options": "i"}})
}



module.exports = {
    insert,
    getData,
    search
}