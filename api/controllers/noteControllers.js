import { Note } from "../../models/Note.js";
import mongoose from "mongoose";

export const noteControllers = {
  addNote: async (req, res) => {
    const { title, content, tags = [], isPinned = false } = req.body;

    const userId = req.user.user._id; // Logged-in user's MongoDB _id

    if (!title) {
      return res
        .status(400)
        .json({ error: true, message: "Title is required" });
    }

    if (!content) {
      return res
        .status(400)
        .json({ error: true, message: "Content is required" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized - no user ID found" });
    }

    try {
      const note = await Note.create({
        title,
        content,
        tags,
        isPinned,
        userId, // 🔥 Save user as ObjectId reference
      });

      return res.status(201).json({
        error: false,
        note,
        message: "Note added successfully",
      });
    } catch (error) {
      console.error("Error creating note:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  },
  editNote: async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
      return res
        .status(400)
        .json({ error: true, message: "No changes provided" });
    }

    try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });

      if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }

      if (title) note.title = title;
      if (content) note.content = content;
      if (tags) note.tags = tags;
      if (isPinned) note.isPinned = isPinned;

      await note.save();

      return res.json({
        error: false,
        note,
        message: "Note updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  },
  getUserNotes: async (req, res) => {
    const { user } = req.user;

    try {
      const notes = await Note.find({ userId: user._id }).sort({
        isPinned: -1,
      });

      return res.json({
        error: false,
        notes,
        message: "All notes retrieved successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  },
  deleteUserNote: async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });

      if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }

      await Note.deleteOne({ _id: noteId, userId: user._id });

      return res.json({
        error: false,
        message: "Note deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  },
  searchUserNotes: async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: true, message: "Search query is required" });
    }

    try {
      const matchingNotes = await Note.find({
        userId: user._id,
        $or: [
          { title: { $regex: new RegExp(query, "i") } }, // Case-insensitive title match
          { content: { $regex: new RegExp(query, "i") } }, // Case-insensitive content match
          { tags: { $regex: new RegExp(query, "i") } },
        ],
      });

      return res.json({
        error: false,
        notes: matchingNotes,
        message: "Notes matching the search query retrieved successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  },
  getNoteById: async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
      // Find the note by ID and ensure it belongs to the logged-in user
      const note = await Note.findOne({ _id: noteId, userId: user._id });

      if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }

      return res.json({
        error: false,
        note,
        message: "Note retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching note:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  },
  visibilityNote: async (req, res) => {
    const { isPublic } = req.body;
    const { user } = req.user;

    try {
      const note = await Note.findOneAndUpdate(
        { _id: req.params.noteId, userId: user._id }, // Ensure the note belongs to the user
        { isPublic },
        { new: true } // Return the updated note
      );

      if (!note) {
        return res
          .status(404)
          .json({ error: true, message: "Note not found or unauthorized" });
      }

      res.status(200).json({ error: false, note });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Server error" });
    }
  },
  publicNote: async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: true, message: "Invalid user ID" });
    }

    try {
      const notes = await Note.find({
        userId,
        isPublic: true, // Only fetch public notes
      }).sort({ createdOn: -1 }); // Sort by creation date (newest first)

      res.status(200).json({ error: false, notes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Server error" });
    }
  },
  getAllNotes: async (req, res) => {
    try {
      const notes = await Note.find({ isPublic: true });
      return res.json({
        error: false,
        notes,
        message: "All notes retrieved successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  },
};
