import { NextFunction, Request, Response } from "express";

export const isBarber = (req:Request, res:Response, next: NextFunction) => {
    const {role} = res.locals.decodedAccountData
    if(role !== "BARBER"){
        throw new Error("Sem autorização para estar aqui, parça. Volte uma casa 1")
    }
    next()
}
export const isClient = (req:Request, res:Response, next: NextFunction) => {
    const {role} = res.locals.decodedAccountData
    if(role !== "CLIENT"){
        throw new Error("Sem autorização para estar aqui, parça. Volte uma casa 2")
    }
    next()
}

export const isAdmin = (req:Request, res:Response, next: NextFunction) => {
    const {role} = res.locals.decodedAccountData
    if(role !== "ADMIN"){
        throw new Error("Só Admins podem estar aqui, parça. Volte uma casa 3")
    }
    
    next()
}
