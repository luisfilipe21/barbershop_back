import { ILogin } from "../interface/user.interfaces";
import { UserServices } from "./user.services";
import { generateToken } from "../config/jwt.config";
import * as bcrypt from "bcrypt";

export class LoginService {
  private userServices = new UserServices();

  login = async (payload: ILogin) => {
    
    const validUser = await this.userServices.sameEmail(payload.email);

    if (!validUser) throw new Error("Invalid user");

    const decryptedPassword = await bcrypt.compare(
      payload.password,
      validUser.password,
    )
    if (!decryptedPassword)
      throw new Error("Invalid credentials");

    const token = generateToken(
      { name: validUser.name, email: validUser.email, role: validUser.role },
      validUser.id
    );
    
    return token;
  };
}
