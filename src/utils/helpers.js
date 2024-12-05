import dayjs from "dayjs";

export const getColorByWaitingTime = (observationDateTime) => {
    const currentTime = dayjs(); // Current date-time
    const observationTimeParsed = dayjs(observationDateTime); // Parse the observation date-time
    const waitingTimeMinutes = currentTime.diff(observationTimeParsed, 'minute'); // Calculate the difference in minutes
  
    if (waitingTimeMinutes <= 10) {
      return 'green';
    } else if (waitingTimeMinutes <= 20) {
      return 'orange';
    } else {
      return 'red';
    }
  };
  

export const formatElapsedTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} ago`;
    }
  };