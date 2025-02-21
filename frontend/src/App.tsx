import "./App.css";
import { Outlet } from "react-router-dom";
import AppBar from "./routes/Components/Navbar/AppBar";

function App() {
  return (
    <>
      <div>
        <AppBar />
        <h1>MervilTime</h1>
        <Outlet />
        <p>This is the App component</p>
      </div>
    </>
  );
}

export default App;
