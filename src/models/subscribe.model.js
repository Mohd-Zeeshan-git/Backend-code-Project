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

},{timestamps:true})

const subscription = mongoose.model("Subscription", subscriptionSchema);

export default subscription;