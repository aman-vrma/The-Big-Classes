import { useState } from "react";
import { Switch, Route, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { Layout } from "./components/layout";
import { SplashScreen } from "./components/SplashScreen";

import { Dashboard } from "./pages/dashboard";
import { Quiz } from "./pages/quiz";
import { LessonPlan } from "./pages/lesson-plan";
import { Assignment } from "./pages/assignment";
import { Grade } from "./pages/grade";
import { HistoryPage } from "./pages/history";
import { StudentPortal } from "./pages/student-portal";
import { StudentHistoryPage } from "./pages/student-history";
import { AuthPage } from "./pages/auth-page";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-3">
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="text-slate-400 text-sm">The page you are looking for does not exist.</p>
    </div>
  );
}

function AppRoutes() {
    const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }
  // 1. Agar user logged in nahi hai -> ALWAYS SHOW AUTH / LOGIN SCREEN
  if (!user) {
    return <AuthPage />;
  }

  // 2. Agar student login kiya -> Sirf Student Portal
  if (user.role === "student") {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={StudentPortal} />
          <Route path="/student" component={StudentPortal} />
          <Route path="/student-portal" component={StudentPortal} />
          <Route path="/student-history" component={StudentHistoryPage} />
          <Route>
            <Redirect to="/student" />
          </Route>
        </Switch>
      </Layout>
    );
  }

  // 3. Agar teacher login kiya -> Full Teacher Command Center
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/lesson-plan" component={LessonPlan} />
        <Route path="/assignment" component={Assignment} />
        <Route path="/grade" component={Grade} />
        <Route path="/student" component={StudentPortal} />
        <Route path="/student-portal" component={StudentPortal} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;