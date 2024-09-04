import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import Dashboard from "./component/Dashboard";
import Chat from "./component/Chat";
import Navbar from "./component/Navbar";
import Login from "./component/Login";
import { PrivatePath } from "./component/privateRoutes";
import Help from "./component/Help";
import Footer from "./component/Footer";

function App() {
  return (
        <div className="App" style={{ position: "relative", height: "100vh" }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<PrivatePath />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/help" element={<Help />} />
            </Route>
          </Routes>
          <Footer />
        </div>
  );
}

export default App;
