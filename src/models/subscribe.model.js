import mongoose, { Schema, schema } from "mongoose";

const subscriptionSchema = new schema({
    subscriber: {
        type: Schema.Types.ObjectId,//one to whom 'subscriber' is subscribing
        ref:"User"
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref:"User"
    }

},{timeStamps:true})

const subscription = mongoose.model("subscribe", subscriptionSchema);

export default subscription;