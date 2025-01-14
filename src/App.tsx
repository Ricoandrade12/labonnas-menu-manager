import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Tables from "@/pages/Tables"
import MenuSelection from "@/pages/MenuSelection"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Tables />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/menu" element={<MenuSelection />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App