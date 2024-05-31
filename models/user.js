import mongoose from "mongoose";

// опис моделі  користувача для mongoose
const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      // визначення на рівні БД унікальності
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    }    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
