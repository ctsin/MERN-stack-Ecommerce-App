import axios from "axios";
import { Field, Form, Formik, FormikConfig } from "formik";
import { useAuth } from "./AuthProvider";
import { isNull } from "lodash";

interface Values {
  username: string;
  password: string;
}

export const SignUp = () => {
  const initialValues: Values = {
    username: "",
    password: "",
  };

  const onSubmit = async (values: Values) => {
    await axios.post<Values>("/api/v1/auth/register", values);
  };

  return (
    <div>
      <h4>Sign Up</h4>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <Field name="username" placeholder="username" />
          <Field name="password" placeholder="password" />
          <button type="submit">Sign Up</button>
        </Form>
      </Formik>
    </div>
  );
};
export const SignIn = () => {
  const { setAuth } = useAuth();

  const initialValues: Values = {
    username: "",
    password: "",
  };

  const onSubmit: FormikConfig<Values>["onSubmit"] = async (values) => {
    try {
      const { data } = await axios.post("/api/v1/auth/login", values);
      if (data.success) {
        setAuth((prev) => ({ ...prev, ...data.user }));

        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h4>Sign In</h4>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form style={{ display: "inline-block" }}>
          <Field name="username" placeholder="username" />
          <Field name="password" placeholder="password" />
          <button type="submit">Sign In</button>
        </Form>
      </Formik>

      <SignOut />
    </div>
  );
};

export const useSignOut = () => {
  const { setAuth } = useAuth();

  return () => {
    setAuth(null);

    localStorage.removeItem("user");
  };
};

export const SignOut = () => {
  const signOut = useSignOut();

  const onClick = () => {
    signOut();
  };

  return (
    <button style={{ marginLeft: "22px" }} onClick={onClick}>
      Sign Out
    </button>
  );
};

const resetFormInitialValues = {
  password: "",
  newPassword: "",
  confirmPassword: "",
};

type ResetFormValues = typeof resetFormInitialValues;

export const Reset = () => {
  const { auth } = useAuth();
  const signOut = useSignOut();

  if (isNull(auth)) return null;

  const onSubmit: FormikConfig<ResetFormValues>["onSubmit"] = async (
    values
  ) => {
    try {
      const {
        data: { success },
      } = await axios.post("/api/v1/auth/reset", { id: auth.id, ...values });

      if (success) {
        signOut();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h4>Reset Password</h4>
      <Formik initialValues={resetFormInitialValues} onSubmit={onSubmit}>
        <Form>
          <Field name="password" placeholder="Current password" />
          <Field name="newPassword" placeholder="New password" />
          <Field name="confirmPassword" placeholder="Confirm new password" />
          <button type="submit">Reset</button>
        </Form>
      </Formik>
    </div>
  );
};

export const Auth = () => {
  return (
    <>
      <SignUp />
      <SignIn />
    </>
  );
};
