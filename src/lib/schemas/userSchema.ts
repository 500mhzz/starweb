import { Schema, model } from "mongoose"

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    username: String,
    userNick: { type: String, default: null },
    anonymous: { type: Boolean, default: false },
})

export default model("userSchema", userSchema, "users")
