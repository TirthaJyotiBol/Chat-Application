import express from "express";

const chatRouter = express.Router();

chatRouter.get('/',(req,res)=>{
    res.render('chat');
})

export default chatRouter;