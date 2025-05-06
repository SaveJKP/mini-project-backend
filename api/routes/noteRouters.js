import express from "express";
import { noteControllers } from "../controllers/noteControllers.js";
import { authUser } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/add-note", authUser, noteControllers.addNote);

router.get("/public-notes/:userId", noteControllers.publicNote);
router.get("/get-note/:noteId", authUser, noteControllers.getNoteById);
router.get("/get-all-notes", authUser, noteControllers.getUserNotes);
router.get("/search-notes", authUser, noteControllers.searchUserNotes);
router.put("/edit-note/:noteId", authUser, noteControllers.editNote);
router.get("/get-all", noteControllers.getAllNotes)
router.put(
  "/note-ispublic/:noteId",
  authUser,
  noteControllers.visibilityNote
);
router.delete("/delete-note/:noteId", authUser, noteControllers.deleteUserNote);

export default router;
