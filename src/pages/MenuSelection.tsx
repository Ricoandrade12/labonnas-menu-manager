import React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface MenuItem {
  id: string
  name: string
  price: number
  category: "rodizio" | "diaria"
}

const menuItems: MenuItem[] = [
  { id: "1", name: "Rodízio de Maminha", price: 14, category: "rodizio" },
  { id: "2", name: "Rodízio de Picanha", price: 19, category: "rodizio" },
  { id: "3", name: "Especial Picanha", price: 26, category: "rodizio" },
  { id: "4", name: "Diária 1", price: 8, category: "diaria" },
  { id: "5", name: "Diária 2", price: 9, category: "diaria" },
  { id: "6", name: "Diária 3", price: 10, category: "diaria" },
]

const MenuSelection = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSelectItem = (item: MenuItem) => {
    toast({
      title: "Item selecionado",
      description: `${item.name} - €${item.price}`,
    })
    // TODO: Implement item selection logic
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Cardápio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600 mb-4">€{item.price}</p>
              <Button 
                onClick={() => handleSelectItem(item)}
                className="w-full bg-[#518426] hover:bg-[#518426]/90"
              >
                Selecionar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/tables")}
          className="border-[#518426] text-[#518426]"
        >
          Voltar para Mesas
        </Button>
        <Button
          onClick={() => navigate("/extras")}
          className="bg-[#518426] hover:bg-[#518426]/90"
        >
          Extras e Bebidas
        </Button>
      </div>
    </div>
  )
}

export default MenuSelection