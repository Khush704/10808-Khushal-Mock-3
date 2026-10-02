const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const createComplaint = async (req, res) => {
  try {
    const {
      studentName,
      email,
      title,
      description,
      category,
      priority,
      location
    } = req.body;

    if (!studentName || !email || !title || !description) {
      return res.status(400).json({
        success: false,
        message:
          "studentName, email, title and description are required"
      });
    }

    const complaint = await Complaint.create({
      studentName,
      email,
      title,
      description,
      category,
      priority,
      location
    });

    res.status(200).json({
      success: true,
      message: "created successfully",
      data: complaint
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed ",
      error: error.message
    });
  }
};
const getComplaints = async (req, res) => {
  try {
    const {
      status,
      category,
      priority,
      search
    } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.search = [
        {
          title: {
            $regex: search,
          }
        },
        {
          studentName: {
            $regex: search,
          }
        }
      ];
    }

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed",
      error: error.message
    });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(400).json({
        success: false,
        message: "Failed"
      });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed",
      error: error.message
    });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      });
    }

    const allowedFields = [
      "studentName",
      "email",
      "title",
      "description",
      "category",
      "priority",
      "location"
    ];

    const updateData = {};

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        Validators: true
      }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      data: complaint
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update complaint",
      error: error.message
    });
  }
};
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID"
      });
    }

    const validStatuses = [
      "Open",
      "In Progress",
      "Resolved",
      "Rejected"
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values: Open, In Progress, Resolved, Rejected"
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );

    if (!complaint) {
      return res.status(400).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "updated successfully",
      data: complaint
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed",
      error: error.message
    });
  }
};
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      });
    }

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(400).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
      data: complaint
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed",
      error: error.message
    });
  }
};


module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint
};