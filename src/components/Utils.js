export const today = new Date();
  export const todayWithoutTimezone = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).toISOString().split("T")[0];