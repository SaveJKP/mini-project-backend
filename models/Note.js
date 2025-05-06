import { Schema, model } from "mongoose";

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  isPinned: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  userId: {
    type: Schema.Types.ObjectId, // ใช้ ObjectId ซึ่งเป็น default _id ของ Mongoose
    ref: "User", // อ้างอิงไปยัง Model ชื่อ 'User' (ซึ่ง Mongoose จะสร้างจาก UserSchema โดยอัตโนมัติ)
    required: true,
  },
  createdOn: { type: Date, default: new Date().getTime() },
});

export const Note = model("Note", NoteSchema);
