const multer = require("multer")
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})
const singleUpload = multer({
    storage:storage
}).fields([{name:"productImage", maxCount:1},{name:"pdf",maxCount:1},{name:"front_image",maxCount:1}])


const storages = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})
const singleimageUpload = multer({
    storage:storages
}).fields([{name:"updatedImage", maxCount:1}])


module.exports = {
    singleUpload,singleimageUpload
}
