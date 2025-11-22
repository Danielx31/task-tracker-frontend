import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import "./App.css";

export default function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <AuthWrapper
        showRegister={showRegister}
        setShowRegister={setShowRegister}
      />
    </AuthProvider>
  );
}

function AuthWrapper({
  showRegister,
  setShowRegister,
}: {
  showRegister: boolean;
  setShowRegister: (show: boolean) => void;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onToggleLogin={() => setShowRegister(false)} />
    ) : (
      <Login onToggleRegister={() => setShowRegister(true)} />
    );
  }
}
