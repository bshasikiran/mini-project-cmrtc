const Complaint = require("../models/complaintModel");

//create the complaint
const createComplaint = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.user.userId);
        const { title, description, department } = req.body;
        const userId = req.user.userId; // Assuming you have user info from auth middleware

        const complaint = new Complaint({ title, description, department, user: userId, status: "pending", isResolved: false });
        const savedComplaint = await complaint.save();

        res.status(201).json({
            success: true,
            message: "Complaint created successfully",
            complaint: savedComplaint
        });
    } catch (error) {
        console.error("Create complaint error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating complaint",
            error: error.message
        });
    }
}


//get all complaints for the user
const getComplaintsForUser = async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user.id });
        res.status(200).json({ complaints });
    } catch (error) {
        res.status(500).json({ message: "Error getting complaints" });
    }
}


//get all complaints for the admin 
const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.status(200).json({ complaints });
    } catch (error) {
        res.status(500).json({ message: "Error getting complaints" });
    }
}


//resolve the complaint
const resolveComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        // Check if response text is provided
        if (!response) {
            return res.status(400).json({ message: "Response text is required" });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            id,
            {
                isResolved: true,
                response: response,
                updatedAt: Date.now()
            },
            { new: true } // This returns the updated document
        );
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        res.status(200).json({ message: "Complaint resolved successfully", complaint });
    } catch (error) {
        res.status(500).json({ message: "Error resolving complaint" });
    }
}

//delete the complaint
const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        await Complaint.findByIdAndDelete(id);
        res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting complaint" });
    }
}


module.exports = { createComplaint, getComplaints, getComplaintsForUser, deleteComplaint, resolveComplaint };
