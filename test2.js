import express from 'express';
import bodyParser from "body-parser"
import multer from "multer"
var upload = multer();

const app = express();
app.listen(3001, () => (console.log("listening")));
// app.use(bodyParser.urlencoded({ extended: false}));
// app.use(bodyParser.json());
app.use(upload.array()); 
app.use(express.static('public'));

app.post("",async (req,res)=>{
    console.log("req - ",req.body);
    console.log("---------------------------------------");
    // console.log("res - ",Object.keys(res));
})