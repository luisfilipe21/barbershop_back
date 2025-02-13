import express ,{json} from "express";
import dotenv from "dotenv";
import helmet from "helmet";

const app = express();
dotenv.config();


app.use(helmet())
app.use(json());

app.listen(3000, () =>{
    console.log("tudo certo na porta 3000")
})
