import dayjs from "dayjs";
import { useMemo } from "react";
import { useDate } from "../DateContext";

type RelativeTimeProps = {
  timestamp: string;
};

export default function RelativeTime({
  timestamp,
}: RelativeTimeProps): JSX.Element {
  const { currentDateTime } = useDate();

  const relativeTime = useMemo(() => {
    if (currentDateTime.isBefore(timestamp)) {
      return dayjs().to(timestamp);
    }

    return currentDateTime.to(timestamp);
  }, [currentDateTime, timestamp]);

  return <>{relativeTime}</>;
}
