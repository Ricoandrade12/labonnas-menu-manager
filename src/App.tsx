import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Tables from "@/pages/Tables"
import MenuSelection from "@/pages/MenuSelection"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/AuthContext"
import Login from "@/pages/Login"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Tables />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/menu" element={<MenuSelection />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  )
}

export default App