const express = require("express")

const router = express.Router()


const { create, read, find } = require("../controllers/ProductControllers")

router.route("/").post(create)
router.route("/").get(read)
router.route("/:search").post(find)



module.exports = router