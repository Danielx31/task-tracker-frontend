import { useState, useEffect, useCallback } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { taskApi } from "./lib/api";
import { User } from "lucide-react";
import { toast } from "sonner";
import "./App.css";

function TaskApp() {
  const { user } = useAuth();
  const [setTasks] = useState<Task[]>([]);
  const [setIsLoading] = useState(false);
  const [setCurrentPage] = useState(1);
  const [setTotalPages] = useState(1);
  const [filters] = useState<TaskFilters>({});
  const [setError] = useState<string | null>(null);

  const fetchTasks = useCallback(
    async (page = 1, currentFilters = filters) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await taskApi.getTasks(page, currentFilters);
        setTasks(response.data);
        if (response.meta) {
          setCurrentPage(response.meta.current_page);
          setTotalPages(response.meta.last_page);
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to fetch tasks";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    if (user) {
      fetchTasks(1);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="flex item-center justify-between">
            <div className="space-y-2">
              <h1>Task Tracker</h1>
              <p className="text-muted-foreground">
                Manage your tasks efficiently with full CRUD operations
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="size-4" />
                <span>{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  return <TaskApp />;
}
