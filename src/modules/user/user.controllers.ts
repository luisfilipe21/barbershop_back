import { Request, Response } from "express";
import { UserServices } from "./user.services";

export class UserController {
  private userServices = new UserServices();

  create = async (req: Request, res: Response) => {
    const user = await this.userServices.create(req.body);
    res.status(201).json(user);
  };

  findAll = async (_: Request, res: Response) => {
    res.status(200).json(await this.userServices.findAll());
  };

  findOne = async (req: Request, res: Response) => {
    const user = await this.userServices.findOne(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
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
    const user = await this.userServices.findOne(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(204).send();
  };
}
