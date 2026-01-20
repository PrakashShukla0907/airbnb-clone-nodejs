import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: { type: String, required: [true, "First name is required"] },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: [true, "Password is required"] },
  accountType: { type: String, enum: ["guest", "host"], default: "guest" },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
    },
  ],
});

export default mongoose.model("User", userSchema);
