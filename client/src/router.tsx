import { createBrowserRouter } from "react-router-dom";
import { Setting } from "./Setting";
import { Protected } from "./Protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected />,
    children: [
      {
        index: true,
        element: <Setting />,
      },
    ],
  },
]);
