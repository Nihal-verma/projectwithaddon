const data = require("../model/projectModel")

const { generateToken } = require("../controller/jwt")
const productData = require("../model/productModel")
const bcrypt = require("bcrypt")


BASE_URL = "http://localhost:80/"





const hashed = async (password) => {
  return await bcrypt.hash(password, 10)
}
const verify = async (password, oldpassword) => {
  return await bcrypt.compare(password, oldpassword)
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const emailverify = await data.findOne({ email: req.body.email })
    if (emailverify) {
      return res.json({ msg: "email already exist" })
    }
    const hashing = await hashed(password)
    const collectData = new data({
      name: name,
      email: email,
      password: hashing
    })
    await collectData.save()
    if (collectData) {
      res.status(200).json({
        message: "data added",
        collectData: collectData  // to show data 
      })
    } else {
      res.status(404).json({
        message: "data not added"
      })
    }
  } catch (error) {
    console.log(" in register", error)
  }

}

const getData = async (req, res) => {
  try {
    const colllectData = await data.findOne({ _id: req.params._id })
    return res.json({
      message: "data fetch",
      colllectData: colllectData
    })
  } catch (error) {
    console.log("error in getData>>>", error);
  }
}


const login = async (req, res) => {
  try {
    const { email, password, oldpassword } = req.body
    const user = await data.findOne({ email: req.body.email })
    if (!user) {
      return res.json({ msg: "user is not register or may have something wrong with email" })
    }
    const verifypassword = await verify(password, user.password)
    console.log(user.password);
    if (!verifypassword) {
      return res.json({ msg: "password incorrect or may have something wrong with password" })
    }
    const token = await generateToken({
      id: user
    })
    return res.status(200).json({
      status: 200,
      message: "User login successfully",
      token: token,
    });

  } catch (error) {
    console.log("error ocurred>>", error);
  }
}



const addproduct = async (req, res) => {
  try {
    const { productName, description } = req.body;
    
    const productImage = req.files.productImage
   
    var allimage =""
    
    productImage.forEach((files,index,array) => {
      allimage =   files.filename +"," +allimage
      console.log(allimage);
    });
    allimage= allimage.substring(0,allimage.lastIndexOf(","))
    const arrallimage = allimage.split(",")
    const str = arrallimage.toString()
    console.log(arrallimage);
    // console.log(str);

    const pdf = req.files.pdf
    var allpdf=""
  
    pdf.forEach((files,index,array) => {
      allpdf = files.filename +","+ allpdf 
    });
    allpdf= allpdf.substring(0,allpdf.lastIndexOf(","))


    
    const front_image = req.files.front_image
  
    var allFrontImage=""

    front_image.forEach((files,index,array) => {
      allFrontImage =files.filename +","+ allFrontImage 
    });
    allFrontImage= allFrontImage.substring(0,allFrontImage.lastIndexOf(","))

    if (!productName || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }


    const collectData = await new productData({
      productName: productName,
      productImage: arrallimage,
      description: description,
      pdf: allpdf,
      front_image: allFrontImage
    });

    await collectData.save();
    res.json({ msg: "Data saved", data: collectData });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getallproduct = async (req, res) => {
  try {
    const collectData = await productData.find()
    res.json({ msg: "alldata", data: collectData })
  } catch (error) {
    console.log("error", error);
  }
}

const updateProductImages = async (req, res) => {
  try {

    const { id } = req.params.id
    const {files}= req
    const {productImage} =req.files.productImage
    const {pdf} =req.files.pdf
    const {frontimage} =req.files.front_image
    let proimage
    if(productImage){
      proimage = BASE_URL+ files.filename
    }

    let pdfImage
    if(pdf){
      pdf =BASE_URL+ files.filename
    }

    let front
    if(frontimage){
      front = BASE_URL+ files.filename
    }

    const nn = await productData.findOne({ id: id })
    if (!nn) {
      return res.json({ msg: "data not found" })
    }
   
  //    const productImage = req.files.productImage
  //    console.log("productImage>>",productImage);
  //  var pi =[]
  //   for (const value of productImage ) {
  //     pi.push(value.filename)
  //   }
  //   console.log("pi>>>",pi);
  //   const front_image = req.files.front_image
  //   var fi =[]
  //   for (const value of front_image) {
  //     fi.push(value.filename)
  //   }
  //   console.log("fi>>>",fi);

    const newdata = await productData.findByIdAndUpdate({ _id: req.params.id }, {
      $set: {
        
        productImage:proimage,
        pdf:pdfImage,
        front_image:front
      }
    })
    
    const updateddata = await productData.findById(req.params.id)
    return res.json({ msg: "data has been updated", data: updateddata })

  } catch (error) {
    console.log("error>>", error);
  }
}
// const updateProductImages = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await productData.findOne({ id: id });
//     if (!product) {
//       return res.json({ msg: "Data not found" });
//     }

//     // Find the image you want to update based on a unique identifier or criteria
//     const imageToUpdate = product.productImage.find(
//       image => image.uniqueIdentifier === req.body.uniqueIdentifier
//     );

//     if (!imageToUpdate) {
//       return res.json({ msg: "Image not found" });
//     }

//     // Update the image with the new image filename
//     imageToUpdate.filename = req.files.productImage[0].filename;

//     // Update the image array in the database
//     const updatedData = await productData.findByIdAndUpdate(
//       { _id: id },
//       {
//         $set: {
//           productImage: product.productImage,
//         },
//       }
//     );

//     // Retrieve the updated data from the database
//     const updatedProduct = await productData.findById(id);

//     return res.json({
//       msg: "Data has been updated",
//       data: updatedProduct,
//     });
//   } catch (error) {
//     console.log("Error:", error);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };
const updatesingleimage = async(req,res)=>{
  try {
  
    const imageToUpdate= req.body.imageToUpdate
    // const{newimage}=req.files.newimage
    const updatedImage = req.files.updatedImage;
    
    // Check if the updatedImage variable is defined and contains files
    if (!updatedImage || updatedImage.length === 0) {
      return res.status(400).json({ message: 'No updated image provided' });
    }

    const product = await productData.findById(req.params.id);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the image to update in the productImage array
    let imageUpdated = false;
    for (let i = 0; i < product.productImage.length; i++) {
      const image = product.productImage[i];
      console.log(image);

      // Match the image based on some criteria (e.g., name or ID)
      if (image === imageToUpdate) {
        product.productImage[i] = updatedImage[0].filename;
        imageUpdated = true;
        break; // Exit the loop once the image is found and updated
      }
    }

    if (!imageUpdated) {
      return res.status(404).json({ message: 'Image not found in the productImage array' });
    }

    // Save the updated product
    await product.save();
  } catch (error) {
    console.log("err>>",error);
  }
}

module.exports = { register, getData, login, getallproduct, addproduct, updateProductImages,updatesingleimage }



// extra code from updateproductimage api
 // const { productName, description } = req.body;
 
  // const productImage = req.files.productImage
  // console.log("productimage>>>",productImage);
  // var pi = productImage.forEach((value) => {
  //   console.log("value>>>",value);
  //   console.log("filename>>",value.filename);
  //   return value.filename
  // });
  // console.log(pi);
  // const front_image = req.files.front_image
  // var fi = front_image.forEach((value)=>{
  //   return value.filename
  // })