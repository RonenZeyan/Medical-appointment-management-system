const mongoose = require("mongoose");

module.exports = (req,res,next)=>{

    
    //check if the id is legal or illegal
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({message:"Invalid Id"});
    }
    next(); //if id is valid and legal then go to next func/req
}