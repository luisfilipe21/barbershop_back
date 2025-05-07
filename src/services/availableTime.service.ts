// import { prisma } from "../config/database";

// export class AvailableTimeService {
  
//   listAllAvailableTime = async (userId: number, date: string) => {
//     return await prisma.wordDay.findMany({
//       where: { userId, date: new Date(date) },
//     });
//   };

//   setAvailableTime = async (
//     userId: number,
//     date: string,
//     startTime: string,
//     endTime: string) => {



//     return await prisma.availableTime.create({
//         data: { userId, date: new Date(date), startTime, endTime },
//       });
//   }
// }
