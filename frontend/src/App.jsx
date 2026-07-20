import { useTheme } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <AppRoutes />
    </div>
  );
}

export default App;
