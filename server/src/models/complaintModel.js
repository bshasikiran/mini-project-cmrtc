const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

    title: {type: String, required: true},
    description: {type: String, required: true},
    department: {type: String, required: true, enum: ["Exams", "Admission", "Results", "Library", "Hostel", "Transport", "Other"]},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    response: {type: String, required: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    isResolved: {type: Boolean, default: false},

});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;