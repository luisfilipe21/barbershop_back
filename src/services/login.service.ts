import { ILogin } from "../interface/user.interfaces";
import { UserServices } from "./user.services";
import { generateToken } from "../config/jwt.config";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export class LoginService {
  private userServices = new UserServices();

  private secret = process.env.JWT_SECRET || "secreta";

  verifyToken = async (token: string) => {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      console.log("-----------------------");
      console.log(error);
      return null;
    }
  };

  login = async (payload: ILogin) => {
    const validUser = await this.userServices.sameEmail(payload.email);

    if (!validUser) throw new Error("Invalid user");

    const decryptedPassword = await bcrypt.compare(
      payload.password,
      validUser.password
    );
    if (!decryptedPassword) throw new Error("Invalid credentials");

    if (validUser.role === "CLIENT") {
      return generateToken(
        {
          name: validUser.name,
          role: validUser.role,
          schedule: validUser.Schedule,
        },
        validUser.id
      );
    }
    if (validUser.role === "BARBER") {
      return generateToken(
        {
          name: validUser.name,
          email: validUser.email,
          role: validUser.role,
          schedule: validUser.Schedule,
        },
        validUser.id
      );
    }
    if (validUser.role === "ADMIN") {
      return generateToken(
        {
          name: validUser.name,
          role: validUser.role,
        },
        validUser.id
      );
    }
  };
}
