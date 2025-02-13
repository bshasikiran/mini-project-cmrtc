const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {adminRoleMiddleware, userRoleMiddleware} = require("../middlewares/roleMiddleware");
const {createComplaint, getComplaints, getComplaintsForUser, deleteComplaint, resolveComplaint} = require("../controllers/complaintController");


//only admin can access this route
router.get("/admin/complaints", authMiddleware, adminRoleMiddleware, getComplaints);
router.post("/admin/complaints/:id", authMiddleware, adminRoleMiddleware, resolveComplaint);
router.delete("/admin/complaints/:id", authMiddleware, adminRoleMiddleware, deleteComplaint);


//both user and admin can access this route
router.post("/user/create-complaint", authMiddleware , userRoleMiddleware, createComplaint);
router.get("/user/complaints", authMiddleware , userRoleMiddleware, getComplaintsForUser);





module.exports = router;
