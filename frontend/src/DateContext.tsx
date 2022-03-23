import dayjs, { Dayjs } from "dayjs";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDateString } from "./utils/dates";

type DateContextState = {
  currentDateTime: Dayjs;
  selectedDate: Dayjs;
  selectedPuzzleDate: string;
};

const DateContext = createContext<DateContextState>({} as DateContextState);

const TIME_RELOAD_IN_MS = 60 * 1000;

export function DateProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(dayjs());
    }, TIME_RELOAD_IN_MS);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const dateStr = useMemo(() => {
    const dateParam = new URLSearchParams(search).get("date")?.trim();
    if (!dateParam || currentDateTime.isSame(dateParam, "day")) {
      return undefined;
    }

    return dateParam;
  }, [currentDateTime, search]);

  useEffect(() => {
    if (search && dateStr === undefined) {
      navigate("/");
    }
  }, [dateStr, navigate, search]);

  const selectedDate = useMemo(() => dayjs(dateStr, "YYYY-MM-DD"), [dateStr]);

  return (
    <DateContext.Provider
      value={{
        currentDateTime,
        selectedDate,
        selectedPuzzleDate: formatDateString(selectedDate),
      }}
    >
      {children}
    </DateContext.Provider>
  );
}

export function useDate(): DateContextState {
  return useContext(DateContext);
}
