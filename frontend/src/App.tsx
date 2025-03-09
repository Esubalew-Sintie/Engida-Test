import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskList from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css"
import NotFound from "./pages/NotFound";

const App = () => (
  <Router>
    <Routes >
      
      <Route path="/" element={<TaskList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
