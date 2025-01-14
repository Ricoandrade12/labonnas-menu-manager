import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Plus, Minus, Trash2, User } from "lucide-react"
import { Input } from "@/components/ui/input"

interface MenuItem {
  id: string
  name: string
  price: number
  category: "rodizio" | "diaria" | "bebida"
}

interface OrderItem extends MenuItem {
  quantity: number
}

const menuItems: MenuItem[] = [
  { id: "1", name: "Rodízio de Maminha", price: 14, category: "rodizio" },
  { id: "2", name: "Rodízio de Picanha", price: 19, category: "rodizio" },
  { id: "3", name: "Especial Picanha", price: 26, category: "rodizio" },
  { id: "4", name: "Diária 1", price: 8, category: "diaria" },
  { id: "5", name: "Diária 2", price: 9, category: "diaria" },
  { id: "6", name: "Diária 3", price: 10, category: "diaria" },
]

const bebidas: MenuItem[] = [
  { id: "b1", name: "Coca-Cola", price: 3, category: "bebida" },
  { id: "b2", name: "Água Mineral", price: 2, category: "bebida" },
  { id: "b3", name: "Cerveja", price: 4, category: "bebida" },
  { id: "b4", name: "Suco Natural", price: 3.5, category: "bebida" },
  { id: "b5", name: "Vinho Tinto", price: 15, category: "bebida" },
  { id: "b6", name: "Refrigerante", price: 3, category: "bebida" },
]

const MenuSelection = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [tableResponsible, setTableResponsible] = useState("")

  const handleQuantityChange = (item: MenuItem, change: number) => {
    setOrderItems(prev => {
      const existingItem = prev.find(i => i.id === item.id)
      if (existingItem) {
        const newQuantity = existingItem.quantity + change
        if (newQuantity <= 0) {
          return prev.filter(i => i.id !== item.id)
        }
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: newQuantity }
            : i
        )
      }
      if (change > 0) {
        return [...prev, { ...item, quantity: 1 }]
      }
      return prev
    })
  }

  const removeItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId))
    toast({
      title: "Item removido",
      description: "Item removido do pedido",
    })
  }

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSendToKitchen = () => {
    if (!tableResponsible.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o responsável da mesa",
        variant: "destructive",
      })
      return
    }

    if (orderItems.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione itens ao pedido primeiro",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Pedido enviado",
      description: "Seu pedido foi enviado para a cozinha",
    })
    setOrderItems([])
    setTableResponsible("")
  }

  const renderMenuItem = (item: MenuItem) => (
    <Card key={item.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <CardTitle className="text-base">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-lg font-bold text-green-600 mb-2">€{item.price}</p>
        <div className="flex items-center justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuantityChange(item, -1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {orderItems.find(i => i.id === item.id)?.quantity || 0}
          </span>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item, 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Cardápio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map(renderMenuItem)}
          </div>

          <h2 className="text-2xl font-bold my-6">Bebidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bebidas.map(renderMenuItem)}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <Input
                    placeholder="Responsável da mesa"
                    value={tableResponsible}
                    onChange={(e) => setTableResponsible(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <span>{item.name} x{item.quantity}</span>
                      </div>
                      <span>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>€{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleSendToKitchen}
                  className="w-full bg-[#518426] hover:bg-[#518426]/90 mt-4"
                >
                  Enviar para Cozinha
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/tables")}
                  className="w-full mt-2 border-[#518426] text-[#518426]"
                >
                  Voltar para Mesas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MenuSelection