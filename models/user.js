const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            match: [/\S+@\S+\.\S+/, "is invalid"],
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Organization',
        }
    }
);

module.exports = mongoose.model('User', userSchema);