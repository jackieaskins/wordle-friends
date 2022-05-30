import dayjs, { Dayjs } from "dayjs";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { formatDateString } from "./utils/dates";
import { useManageSearchParams } from "./utils/searchParams";

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
  const { searchParams, removeSearchParam } = useManageSearchParams();
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
    const dateParam = searchParams.get("date")?.trim();
    if (!dateParam || currentDateTime.isSame(dateParam, "day")) {
      return undefined;
    }

    return dateParam;
  }, [currentDateTime, searchParams]);

  useEffect(() => {
    if (searchParams.has("date") && dateStr === undefined) {
      removeSearchParam("date");
    }
  }, [dateStr, removeSearchParam, searchParams]);

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
