import axios from "axios";
import { isNull } from "lodash";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContext = Record<"id" | "username" | "token", string> | null;

const authContext = createContext<{
  auth: AuthContext;
  setAuth: Dispatch<SetStateAction<AuthContext>>;
}>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthContext>({
    id: "",
    username: "",
    token: "",
  });
  console.log("🚀 ~ AuthProvider ~ auth:", auth);
  axios.defaults.headers.common.Authorization = auth?.token ?? "";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (isNull(user)) return;

    setAuth((prev) => ({ ...prev, ...JSON.parse(user) }));
  }, []);

  return (
    <authContext.Provider value={{ auth, setAuth }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
