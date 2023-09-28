import propertyModel from "../models/property.js";

class propertyController{
    static getAllProperty = async (req,res)=>{
        try {
            // Fetch all properties from the database
            const properties = await propertyModel.find();
    
            // Respond with the list of properties
            return res.status(200).json(properties);
        }catch(error) {
            // Handle any errors that occur during the process
            console.error("Error fetching properties:", error);
            return res.status(500).json({ error: "An error occurred while fetching properties" });
        }
    }

    static getPropertyByUser = async (req,res) => {
        try {
            // Extract the userId from the request parameters
            const userId = req.user._id;
        
            // Fetch properties that belong to the specified userId
            const properties = await propertyModel.find({ user: userId });
        
            // Respond with the list of properties
            return res.status(200).json(properties);
        }catch(error) {
            // Handle any errors that occur during the process
            console.error("Error fetching properties by userId:", error);
            return res.status(500).json({ error: "An error occurred while fetching properties by userId" });
        }
    }

    static postProperty = async (req,res) =>{
        try {
            const {
                image,
                city,
                District,
                type,
                price,
                Available_from,
                beds,
                bathroom,
                size,
            } = req.body;
        
            // Create a new property document using the property model
            const newProperty = new propertyModel({
                user:req.user._id,
                image,
                city,
                District,
                type,
                price,
                Available_from,
                beds,
                bathroom,
                size,
            });
        
            // Save the property to the database
            const savedProperty = await newProperty.save();
        
            // Respond with the saved property data
            return res.status(201).json(savedProperty);
        }catch (error) {
            // Handle any errors that occur during the process
            console.error("Error creating property:", error);
            return res.status(500).json({ error: "An error occurred while creating the property" });
        }
    }

    static updateProperty = async (req, res) => {
        try {
            const { id } = req.params; // Assuming the property ID is passed as a route parameter
    
            // Find the property by ID and check if it exists
            const property = await propertyModel.findById(id);
    
            if (!property) {
                return res.status(404).json({ error: "Property not found" });
            }

            if (property.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: "You do not have permission to update this property" });
            }

            if(req.body.city){
                property.city = req.body.city
            }

            if(req.body.image){
                property.image = req.body.image
            }

            if(req.body.District){
                property.District = req.body.District
            }

            if(req.body.type){
                property.type = req.body.type
            }

            if(req.body.price){
                property.price = req.body.price
            }

            if(req.body.Available_from){
                property.Available_from = req.body.Available_from
            }

            if(req.body.beds){
                property.beds = req.body.beds
            }

            if(req.body.bathroom){
                property.bathroom = req.body.bathroom
            }

            if(req.body.size){
                property.size = req.body.size
            }

            const updatedProperty = await property.save();
    
            // Respond with the updated property data
            return res.status(200).json(updatedProperty);
        }catch(error){
            // Handle any errors that occur during the process
            console.error("Error updating property:", error);
            return res.status(500).json({ error: "An error occurred while updating the property" });
        }
    }

    static deleteProperty = async (req, res) => {
        try {
            const { id } = req.params; // Assuming the property ID is passed as a route parameter
    
            // Find the property by ID and check if it exists
            const property = await propertyModel.findById(id);
    
            if (!property) {
                return res.status(404).json({ error: "Property not found" });
            }
    
            // Check if the user making the request is the owner of the property
            if (property.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: "You do not have permission to delete this property" });
            }
    
            // Delete the property
            await propertyModel.findByIdAndDelete(id);
    
            // Respond with a success message
            return res.status(200).json({ success: true,message: "property deleted" }); // 204 means No Content (successful deletion)
        }catch(error) {
            // Handle any errors that occur during the process
            console.error("Error deleting property:", error);
            return res.status(500).json({ error: "An error occurred while deleting the property" });
        }
    }
}

export default propertyController