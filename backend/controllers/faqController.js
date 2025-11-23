// controllers/faqController.js
import FAQ from "../models/FAQ.js";

// GET /api/faqs
export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    // Return array directly in body so frontend can use it easily
    return res.status(200).json(faqs);
  } catch (error) {
    console.error("getFAQs error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/faqs  (admin)
export const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: "Question and answer required" });
    }

    const faq = await FAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      createdBy: req.user?.userId || null,
    });

    return res.status(201).json(faq);
  } catch (error) {
    console.error("createFAQ error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/faqs/:id  (admin)
export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const faq = await FAQ.findById(id);
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });

    if (question) faq.question = question.trim();
    if (answer) faq.answer = answer.trim();

    await faq.save();
    return res.status(200).json(faq);
  } catch (error) {
    console.error("updateFAQ error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/faqs/:id  (admin)
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findById(id);
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });

    await FAQ.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    console.error("deleteFAQ error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
