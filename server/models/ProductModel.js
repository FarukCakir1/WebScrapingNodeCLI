const mongoose = require("mongoose")


const schema = new mongoose.Schema(
    {
        product_name: String,
        Trendyol: mongoose.Schema.Types.Mixed,
        Hepsiburada: mongoose.Schema.Types.Mixed,
        N11: mongoose.Schema.Types.Mixed
    },
    {
        versionKey: false,
        timestamps:true
    }
    )


    const productModel = mongoose.model("product", schema)


    module.exports = productModel