import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
type NavigateOptions = {
  replace?: boolean | undefined;
  state?: any;
};

export function useManageSearchParams(): {
  searchParams: URLSearchParams;
  addSearchParam: (
    name: string,
    value: string,
    navigateOptions?: NavigateOptions
  ) => void;
  removeSearchParam: (name: string, navigateOptions?: NavigateOptions) => void;
  setSearchParams: (
    nextInit: URLSearchParamsInit,
    navigateOptions?: NavigateOptions
  ) => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();

  function addSearchParam(
    name: string,
    value: string,
    navigateOptions?: NavigateOptions
  ) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(name, value);
    setSearchParams(newParams, navigateOptions);
  }

  function removeSearchParam(name: string, navigateOptions?: NavigateOptions) {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(name);
    setSearchParams(newParams, navigateOptions);
  }

  return { searchParams, addSearchParam, removeSearchParam, setSearchParams };
}
