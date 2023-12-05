import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/homepage/Homepage";
import ChatPage from "./pages/chat/ChatPage";
import UnauthorizedPage from "pages/unauthorizedPage/UnauthorizedPage";
import "./App.css"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/chat" element={<ChatPage/>}></Route>
        <Route path="*" element={<UnauthorizedPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
