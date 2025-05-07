import { sign,verify } from "jsonwebtoken";


export const generateToken = (payload: Object = {}, userId: number) => {
    const secret = process.env.JWT_SECRETS as string;
    const token = sign(payload, secret, {
      expiresIn: "5h",
      subject: String(userId),
    });
    return token
  };
  
  export const verifyToken = (token: string) => {
    const secret = process.env.JWT_SECRETS as string;
    const accountDataJwt = verify(token, secret);
  
    return accountDataJwt;
  };