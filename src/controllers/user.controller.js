import User from "../models/user.model.js";

export const getUserProfile = async(req, res) => {
    const {id} = req.params;

    try {
        const user = await User.findById(id).select("-password");
        if(!user) {
            return res.status(404).json({error: "User not found!"});
        }else{
            return res.status(200).json(user);
        }
    } catch (error) {
        console.log("Error in getUserProfile", error.message);
        res.status(500).json({error: "Internal server error!"})
    }
}