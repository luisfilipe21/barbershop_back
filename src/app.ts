import express ,{json} from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { userRouter } from "./modules/user/user.routes";

const app = express();
dotenv.config();


app.use(helmet())
app.use(json());
app.use(cors());


app.use("/users", userRouter);

app.listen(3000, () =>{
    console.log("tudo certo na porta 3000")
})
