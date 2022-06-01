export function GMTToStr(time: string): string {
  const date = new Date(time);
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();
  const oriHour: number = date.getHours();
  let hour = oriHour.toString();
  if (oriHour < 10) {
    hour = `0${hour}`;
  }
  const oriMinute: number = date.getMinutes();
  let minute = oriMinute.toString();
  if (oriMinute < 10) {
    minute = `0${minute}`;
  }
  const format = `${year}-${month}-${day} ${hour}:${minute}`;
  return format;
}
