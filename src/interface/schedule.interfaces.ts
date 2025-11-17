export interface ISchedule {
  id?: number;
  userId?: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  isAvailable?: boolean;
  googleEventId?: string | null;
}
