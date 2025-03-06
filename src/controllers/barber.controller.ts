import { Request, Response } from "express";
import { BarberServices } from "../services/barber.service";
import { barberCreateSchema } from "../schema/barber.schemas";
import { ZodError } from "zod";

export class BarberController {
  private  barberService = new BarberServices();

  create = async (req: Request, res: Response) => {
    try {
      req.body = barberCreateSchema.parse(req.body);
    } catch (error) {
      if(error instanceof ZodError) {
        res.status(400).json({error: error.message})
      }
      console.log(error);
    }
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
