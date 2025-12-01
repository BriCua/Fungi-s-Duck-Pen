import "./App.css";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { CoupleLinkingPage } from "./pages/CoupleLinkingPage";
import { useAuthContext } from "./context/AuthContext";
import { Spinner } from "./components/ui";
import DuckClicker from "./components/DuckClicker";

function AppContent() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (!user.coupleId) {
    return <CoupleLinkingPage />;
  }

  return (
    <Layout>
      <DuckClicker />
    </Layout>
  );
}

function App() {
  return <AppContent />;
}

export default App;
