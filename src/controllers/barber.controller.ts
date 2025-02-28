import { Request, Response } from "express";
import { BarberServices } from "../services/barber.service";

export class BarberController {
  private  barberService = new BarberServices();

  create = async (req: Request, res: Response) => {
    const barber = await this.barberService.create(req.body);

    res.status(201).json(barber);
  };

  read = async (req: Request, res: Response) => {
    res.status(200).json(await this.barberService.findAll());
  };

  findOne = async (req: Request, res: Response) => {
    const barberId = Number(req.params.id);

    if(!barberId) {
        throw new Error()
    }

    res.status(200).json(await this.barberService.findOne(barberId))
  }
}
