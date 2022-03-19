import dayjs, { Dayjs } from "dayjs";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { formatDateString } from "./utils/dates";

type SelectedDateContextState = {
  date: Dayjs;
  puzzleDate: string;
};

const SelectedDateContext = createContext<SelectedDateContextState>(
  {} as SelectedDateContextState
);

export function SelectedDateProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { search } = useLocation();

  const value = useMemo(() => {
    const date = dayjs(
      new URLSearchParams(search).get("date")?.trim() || undefined,
      "YYYY-MM-DD"
    );

    return {
      date,
      puzzleDate: formatDateString(date),
    };
  }, [search]);

  return (
    <SelectedDateContext.Provider value={value}>
      {children}
    </SelectedDateContext.Provider>
  );
}

export function useSelectedDate(): SelectedDateContextState {
  return useContext(SelectedDateContext);
}
