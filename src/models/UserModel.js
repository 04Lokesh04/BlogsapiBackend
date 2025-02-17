const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const userSchemaRules={
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
        default:"User"
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
}

const userSchema=new mongoose.Schema(userSchemaRules)

userSchema.pre("save", async function (next) {
    if (!this.password) return next(new Error("Password is required!"))

    if (!this.isModified('password')) return next()

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

const UserModel=mongoose.model('UserModel', userSchema)

module.exports=UserModel
