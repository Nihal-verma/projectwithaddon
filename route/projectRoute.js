const express = require("express")
const router = express.Router()
const {verifyToken }= require("../controller/jwt")
const collectdata = require("../controller/projectApi")
const {upload}= require("../middleware/middleware")
const {singleUpload, singleimageUpload}= require("../middleware/singleImage")


router.post("/register",collectdata.register)
router.post("/login",collectdata.login)
router.get("/getData/:id",collectdata.getData)
router.get("/get",verifyToken,collectdata.getallproduct)
router.post("/product",upload,collectdata.addproduct)
router.post("/updateproduct/:id",singleUpload,collectdata.updateProductImages)
router.post("/updateproduct/:id",singleimageUpload,collectdata.updatesingleimage)
module.exports = router