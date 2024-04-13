import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import ProtectedRoutes from "./pages/ProtectedRoutes";
function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
}
export default App;
