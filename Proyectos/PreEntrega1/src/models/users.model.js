import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: {
        type: Number,
        min: 0
    },
    role: {
        type: String,
        default: "user"
    },
    password: String,

    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    }
});

export default model("User", UserSchema);
