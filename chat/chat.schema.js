import mongoose from "mongoose";

let chatSchema = mongoose.Schema({
    message:{type:String},
    currenttime:{type:String},
    username:{type:String}
});

let chatModel = mongoose.model('chats',chatSchema);

export default chatModel;