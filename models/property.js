import mongoose from "mongoose";

//DEFINING SCHEMA
const propertySchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        city: {
            type: String,
            required: true,
        },
        District:{
            type: String,
            required: true,
        },
        type:{
            type: String,
            required: true,
        },
        image:{
            type: String,
            required: false,
        },
        price:{
            type: String,
            required: true,
        },
        Available_from:{
            type: Date,
            required: true,
        },
        beds:{
            type: Number,
            required: true,
        },
        bathroom:{
            type: Number,
            required: true,
        },
        size:{
            type: String,
            required: true,
        }
    },
    {
      timestamps: true,
    }
);

//CREATING MODEL
const propertyModel = mongoose.model("property",propertySchema);
export default propertyModel