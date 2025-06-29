import User from "../models/user.model.js";


// Controller to check the relationship status between the current user and another user
export const checkIsFriend = async (req, res) => {
    const { id } = req.params; // ID of the user to check

    try {
        const idCurrentUser = req.user._id;

        // Find the currently authenticated user
        const currentUser = await User.findById(idCurrentUser);
        if (!currentUser) {
            return res.status(404).json({ error: "Current user not found!" });
        }

        // Find the target user
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ error: "Target user not found!" });
        }

        // Check if they are already friends
        const isFriend = currentUser.friends.includes(id);
        if (isFriend) {
            return res.status(200).json({ message: "Users are friends" });
        }

        // Check if current user sent a friend request to target user
        const isRequestSent = currentUser.friendRequest.includes(id);
        if (isRequestSent) {
            return res.status(200).json({ message: "Friend request sent (outgoing)" });
        }

        // Check if current user has received a friend request from target user
        const isPendingRequest = currentUser.pendingFriendRequest.includes(id);
        if (isPendingRequest) {
            return res.status(200).json({ message: "Friend request received (incoming)" });
        }

        // Otherwise, no relation
        return res.status(200).json({ message: "No friend relationship" });

    } catch (error) {
        console.log("Error in checkIsFriend:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


// Controller to send a friend request
export const sendRequestMakeFriend = async (req, res) => {
    const { id } = req.params; // ID of the user to send the request to

    try {
        const idCurrentUser = req.user._id;

        // Find the current logged-in user
        const currentUser = await User.findById(idCurrentUser);

        if (!currentUser) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Optional: Check if already friends or already sent request
        if (currentUser.friendRequest.includes(id)) {
            return res.status(400).json({ error: "Friend request already sent!" });
        }

        // Add the target user to current user's sent requests
        await User.findByIdAndUpdate(idCurrentUser, {
            $push: { friendRequest: id }
        });

        // Add current user to target user's pending requests
        await User.findByIdAndUpdate(id, {
            $push: { pendingFriendRequest: idCurrentUser }
        });

        return res.status(200).json({ message: "Friend request sent successfully!" });

    } catch (error) {
        console.log("Error in sendRequestMakeFriend:", error.message);
        res.status(500).json({ error: "Internal server error!" });
    }
};


// Controller to accept a friend request
export const acceptRequestMakeFriend = async (req, res) => {
    const { id } = req.params; 

    try {
        const idCurrentUser = req.user._id;

        // Find the current authenticated user
        const currentUser = await User.findById(idCurrentUser);
        if (!currentUser) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Remove from pending and sent friend requests
        await User.findByIdAndUpdate(idCurrentUser, {
            $pull: { pendingFriendRequest: id }
        });

        await User.findByIdAndUpdate(id, {
            $pull: { friendRequest: idCurrentUser }
        });

        // Add each user to the other's friends list
        await User.findByIdAndUpdate(idCurrentUser, {
            $push: { friends: id }
        });

        await User.findByIdAndUpdate(id, {
            $push: { friends: idCurrentUser }
        });

        return res.status(200).json({ message: "Friend request accepsted successfully!" });

    } catch (error) {
        console.log("Error in acceptRequestMakeFriend:", error.message);
        res.status(500).json({ error: "Internal server error!" });
    }
};


// Controller to deny/reject a received friend request
export const denyRequestMakeFriend = async (req, res) => {
    const { id } = req.params; // ID of the user who sent the friend request

    try {
        const idCurrentUser = req.user._id;

        // Find the currently authenticated user
        const currentUser = await User.findById(idCurrentUser);
        if (!currentUser) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Remove the friend request from both users
        await User.findByIdAndUpdate(idCurrentUser, {
            $pull: { pendingFriendRequest: id }
        });

        await User.findByIdAndUpdate(id, {
            $pull: { friendRequest: idCurrentUser }
        });

        return res.status(200).json({ message: "Friend request denied successfully!" });

    } catch (error) {
        console.log("Error in denyRequestMakeFriend:", error.message);
        res.status(500).json({ error: "Internal server error!" });
    }
};


