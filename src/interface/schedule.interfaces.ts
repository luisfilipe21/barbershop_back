export interface ISchedule {
  id?: number;
  barberId: number;
  date: Date;
  isAvailable?: boolean;
}

export interface ITimeSlot {
  id?: number;
  scheduleId: number;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}
