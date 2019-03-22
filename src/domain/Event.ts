interface Event {
  /** For Dates, expecting Epoch date string */
  dateBegin: string;
  dateEnd: string;
  Title: string;
  Description: string;
  Location?:string;
  isAllDay?: boolean;
}