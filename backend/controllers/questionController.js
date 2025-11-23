import Hostel from "../models/Hostel.js";
import User from "../models/User.js";

// Add question to hostel
export const addQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Question text is required" 
      });
    }

    const hostel = await Hostel.findById(id);
    
    if (!hostel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hostel not found" 
      });
    }

    // Add question
    hostel.questions.push({
      userId: req.user.userId,
      text: text.trim(),
      answer: null,
    });

    await hostel.save();

    const updatedHostel = await Hostel.findById(id)
      .populate("ownerId", "name email");

    res.status(200).json({
      success: true,
      message: "Question added successfully",
      hostel: updatedHostel,
    });
  } catch (error) {
    console.error("Add question error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Answer question (owner only)
export const answerQuestion = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    const { answer } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Answer text is required" 
      });
    }

    const hostel = await Hostel.findById(id);
    
    if (!hostel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hostel not found" 
      });
    }

    // Check if user is the owner
    if (hostel.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: "Only the hostel owner can answer questions" 
      });
    }

    // Find and update question
    const question = hostel.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: "Question not found" 
      });
    }

    question.answer = answer.trim();
    question.answeredAt = new Date();
    await hostel.save();

    const updatedHostel = await Hostel.findById(id)
      .populate("ownerId", "name email");

    res.status(200).json({
      success: true,
      message: "Answer added successfully",
      hostel: updatedHostel,
    });
  } catch (error) {
    console.error("Answer question error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Get all questions asked by the logged-in user
export const getQuestionsByUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find all hostels that contain at least one question by this user
    const hostels = await Hostel.find({ "questions.userId": userId }).select("name questions");

    const userQuestions = [];

    hostels.forEach((hostel) => {
      hostel.questions.forEach((q) => {
        if (q.userId.toString() === userId) {
          userQuestions.push({
            questionId: q._id,
            hostelId: hostel._id,
            hostelName: hostel.name,
            question: q.text,
            answer: q.answer || null,
            askedAt: q.createdAt,
            answeredAt: q.answeredAt || null,
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      questions: userQuestions,
    });
  } catch (error) {
    console.error("Get user questions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
