
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/patients";
import Professional from "./pages/Professional";
import Processes from "./pages/processes";
import Hawkins from "./pages/hawkins";
import Users from "./pages/users";
import InviteCodes from "./pages/InviteCodes";
import NotFound from "./pages/NotFound";
import Songs from "./pages/songs";
import MusicalBells from "./pages/musical-bells";
import Finance from "./pages/finance";
import Activities from "./pages/activities";
import InterventionForm from "./pages/intervention";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/professional",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Professional />,
      },
    ],
  },
  {
    path: "/patients",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Patients />,
      },
    ],
  },
  {
    path: "/processes",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Processes />,
      },
    ],
  },
  {
    path: "/hawkins",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Hawkins />,
      },
    ],
  },
  {
    path: "/users",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Users />,
      },
    ],
  },
  {
    path: "/invite-codes",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <InviteCodes />,
      },
    ],
  },
  {
    path: "/songs",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Songs />,
      },
    ],
  },
  {
    path: "/musical-bells",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <MusicalBells />,
      },
    ],
  },
  {
    path: "/finance",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Finance />,
      },
    ],
  },
  {
    path: "/activities",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Activities />,
      },
    ],
  },
  {
    path: "/intervention",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <InterventionForm />,
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
