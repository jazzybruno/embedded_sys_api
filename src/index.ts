import express , {Request , Response , Application} from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/get' , (req : Request , res : Response) => {
    res.send('Hello World');
})

app.listen(PORT, ():void => {
    console.log(`Server Running here 👉 https://localhost:${PORT}`);
  });