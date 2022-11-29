const mongoose = require("mongoose");

const db = mongoose.connection

db.once("open", () => {
    console.log("db connection successful")
})

const connectToDB = async () => {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
}

module.exports = {
    connectToDB
}