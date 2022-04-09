import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AppRoutes from "./routes/AppRoutes";

const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

const theme = extendTheme(
  { config: { useSystemColorMode: true } },
  withDefaultColorScheme({ colorScheme: "blue" }),
  withDefaultColorScheme({ colorScheme: "gray", components: ["Table"] })
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: TEN_MINUTES_IN_MS,
      retry: false,
    },
  },
});

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ChakraProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
