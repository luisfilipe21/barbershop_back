import { NextFunction, Request, Response } from "express";

export const isBarber = (req:Request, res:Response, next: NextFunction) => {
    const {role} = res.locals.decodedAccountData
    if(role === "CLIENT"){
        throw new Error("Sem autorização para estar aqui, parça. Volte uma casa")
    }
    
    next()
}

export const isAdmin = (req:Request, res:Response, next: NextFunction) => {
    const {role} = res.locals.decodedAccountData
    if(role !== "ADMIN"){
        throw new Error("Só Admins podem estaraqui, parça. Volte uma casa")
    }
    
    next()
}
