import mongoose from "mongoose";

// опис моделі  для mongoose
const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    {
        // автоматичне додавання полів createdAt / updatedAT (стварення / оновлення ресурусу) об'єкту в БД 
        timestamps: true,
    }
);

export default mongoose.model("Contact", contactSchema);