interface IDivision {
  amount: number;
  name: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
}

const formatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "narrow",
});

/**
 * Source: https://blog.webdevsimplified.com/2020-07/relative-time-format/
 */
export function formatTimeAgo(date: Date) {
  const DIVISIONS: Array<IDivision> = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ];

  let durationInSeconds = (date.getTime() - new Date().getTime()) / 1000;

  for (let index = 0; index <= DIVISIONS.length; index += 1) {
    const division = DIVISIONS[index];
    if (Math.abs(durationInSeconds) < division.amount) {
      // we reached largest division possible
      return formatter.format(Math.round(durationInSeconds), division.name);
    }
    durationInSeconds /= division.amount;
  }
}
