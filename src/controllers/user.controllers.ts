import { Request, Response } from "express";
import { UserServices } from "../services/user.services";
import { userCreateSchema } from "../schema/user.schemas";

export class UserController {
  private userServices = new UserServices();

  create = async (req: Request, res: Response) => {
    try{

      req.body = userCreateSchema.parse(req.body)
    }catch(error){
      console.log(error);
    }

    const user = await this.userServices.create(req.body);
    res.status(201).json(user);
  };

  findAll = async (_: Request, res: Response) => {
    res.status(200).json(await this.userServices.findAll());
  };

  findOne = async (req: Request, res: Response) => {
    const decoded  = Number(req.params.id);
    const user = await this.userServices.findOne(decoded);

    res.status(201).json(user);
  };

  update = async (req: Request, res: Response) => {
    const updateUser = await this.userServices.updateUser(
      Number(req.params.id),
      req.body
    );
    res.status(200).json(updateUser);
  };

  delete = async (req: Request, res: Response) => {
    const { decodedId } = res.locals;
    const user = await this.userServices.findOne(decodedId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(204).send();
  };
}
