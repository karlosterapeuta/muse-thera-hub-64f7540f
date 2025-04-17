import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import HomePage from "@/pages/home";
import SongsPage from "@/pages/songs";
import MusicTherapyPage from "@/pages/music-therapy";

// Lazy-loaded routes
const ActivitiesPage = lazy(() => import("@/pages/activities"));
const ActivityDetailsPage = lazy(() => import("@/pages/activities/[id]"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const ProfilePage = lazy(() => import("@/pages/profile"));
const NotificationsPage = lazy(() => import("@/pages/notifications"));
const HelpPage = lazy(() => import("@/pages/help"));
const NotFoundPage = lazy(() => import("@/pages/404"));

const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/activities",
    element: <ActivitiesPage />,
  },
  {
    path: "/activities/:id",
    element: <ActivityDetailsPage />,
  },
  {
    path: "/songs",
    element: <SongsPage />,
  },
  {
    path: "/music-therapy",
    element: <MusicTherapyPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/help",
    element: <HelpPage />,
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
];

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
          </Routes>
        </Suspense>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
