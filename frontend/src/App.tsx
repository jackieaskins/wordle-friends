import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AppRoutes from "./routes/AppRoutes";

const theme = extendTheme(
  { config: { useSystemColorMode: true } },
  withDefaultColorScheme({ colorScheme: "blue" })
);

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}
