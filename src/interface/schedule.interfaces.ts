export interface ISchedule {
  id?: number;
  scheduleId?: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  isBooked?: boolean;
}
