import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userModel = new mongoose.Schema({

    name: {
        type:String,
        required:true
    },
    emailId: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    profilePicture: {
        type:String,
        required:true,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }

}, {
    timestamps:true
});


userModel.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    } 
    const salt= await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password, salt)
});


userModel.methods.matchPassword = async function (enteredPassword) {
    
    return bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", userModel);
export default User;