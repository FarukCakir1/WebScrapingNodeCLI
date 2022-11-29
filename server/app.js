const express = require("express")
const cors = require("cors")
const config = require("./config")
const loaders = require("./loaders")

const server = express()
const {ProductRoutes} = require("./routes")

config();
loaders()


server.use(express.json())
server.use(cors())


server.listen("3050", () => {
    console.log("server 3050 portunda aktif")
    server.use("/products", ProductRoutes)
})