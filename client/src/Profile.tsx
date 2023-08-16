import { isNull } from "lodash";
import { useAuth } from "./AuthProvider";
import { SignOut } from "./Auth";

export const Profile = () => {
  const { auth } = useAuth();

  if (isNull(auth)) return null;

  const { username } = auth;

  return (
    <>
      <h4>Profile</h4>
      Signed in as {username}
      <SignOut />
    </>
  );
};
