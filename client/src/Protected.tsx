import { Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { isNull } from "lodash";

export const Protected = () => {
  const { auth } = useAuth();
  console.log("🚀 ~ Protected ~ auth:", auth);

  return isNull(auth) ? <h3>Unauthorized</h3> : <Outlet />;
};
