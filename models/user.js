import mongoose from "mongoose";

//DEFINING SCHEMA
const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: false,
      },
    },
    {
      timestamps: true,
    }
);

// //CREATING MODEL
const userModel = mongoose.model("user",userSchema);
export default userModel