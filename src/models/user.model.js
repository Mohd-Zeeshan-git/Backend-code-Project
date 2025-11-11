import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    username: { type: String, required: true, unique: true , trim: true , lowercase: true  ,index: true },
    email: { type: String, required: true, unique: true , trim: true , lowercase: true   },
    fullname: { type: String, required: true, trim: true, index: true },
   avatar: { type: String // URL to the user's avatar image
    },
   coverimage: { type: String // URL to the user's cover image
    },
//    watchhistory: { type: [String], default: [] // Array of video IDs
//     },
//    playlists: { type: [String], default: [] // Array of playlist IDs
//     },
//    subscriptions: { type: [String], default: [] // Array of channel IDs the user is subscribed to
//     },
//    subscribers: { type: [String], default: [] // Array of user IDs who are subscribed to this user
    //     },
watchhistory:{type:Schema.Types.ObjectId, ref:"video"},
    password: { type: String, required: true },
    refereshToken: { type: String },
    createdAt: { type: Date, default: Date.now }
},{ timestamps: true });

const User = mongoose.model("User", userSchema);
// Hash password before saving the user document to the database

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // isModified checks whether the password field is modified or not returning true or false next() means proceed to next middleware or save operation whch in this case is saving the user document

    this.password = bcrypt.hash(this.password, 10)
    // 10 is the salt rounds i.e. number of times the hashing is applied to the password for security this.password contains the plain text password
    next();
});
userSchema.methods.generateAccessToken = function () {
//      return jwt.sign({
//         _id: this._id,
//         username: this.username,
//         email: this.email,
//         fullname: this.fullname,
//     }, process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    // }
    return jwt.sign({ _Id: this._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _Id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}
userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password, this.password);
}
export default User;