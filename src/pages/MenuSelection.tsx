import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Plus, Minus, Trash2, User, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"

interface MenuItem {
  id: string
  name: string
  price: number
  category: "rodizio" | "diaria" | "bebida"
  description?: string
}

interface OrderItem extends MenuItem {
  quantity: number
}

interface Order {
  id: string
  items: OrderItem[]
  tableResponsible: string
  tableNumber?: string
  seller: string
  total: number
  status: "pending" | "paid"
  timestamp: string
}

const menuItems: MenuItem[] = [
  { 
    id: "1", 
    name: "Rodízio de Maminha", 
    price: 14, 
    category: "rodizio",
    description: "Todos os dias - Buffet livre - maminha chourriço e frango - sobremesa livre"
  },
  { 
    id: "2", 
    name: "Rodízio de Picanha", 
    price: 19, 
    category: "rodizio",
    description: "Buffet livre - picanha - maminha chourriço e frango - sobremesa livre"
  },
  { 
    id: "3", 
    name: "Especial Picanha", 
    price: 26, 
    category: "rodizio",
    description: "Buffet livre - picanha - maminha chourriço e frango - sobremesa livre - bebida incluida"
  },
  { 
    id: "4", 
    name: "Diária 1", 
    price: 8, 
    category: "diaria",
    description: "Seg a Sex - buffet sem churrasco - 1 bebida - sobremsa e cafe"
  },
  { 
    id: "5", 
    name: "Diária 2", 
    price: 9, 
    category: "diaria",
    description: "Seg a Sex - buffet sem churrasco - 1 bebida - sobremsa e cafe - 1 corte de maminha e chouriço"
  },
  { 
    id: "6", 
    name: "Diária 3", 
    price: 10, 
    category: "diaria",
    description: "Seg a Sex - buffet sem churrasco - 1 bebida - sobremsa e cafe - 1 corte de maminha e chouriço"
  },
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
  const [tableNumber, setTableNumber] = useState("")
  const [seller, setSeller] = useState("")
  const [previousOrders, setPreviousOrders] = useState<Order[]>([])

  useEffect(() => {
    const savedOrders = localStorage.getItem("tableOrders")
    if (savedOrders) {
      setPreviousOrders(JSON.parse(savedOrders))
    }
  }, [])

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
    if (!tableResponsible.trim() || !seller.trim() || !tableNumber.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
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

    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...orderItems],
      tableResponsible,
      tableNumber,
      seller,
      total: getTotalPrice(),
      status: "pending",
      timestamp: new Date().toISOString(),
    }

    const updatedOrders = [...previousOrders, newOrder]
    setPreviousOrders(updatedOrders)
    localStorage.setItem("tableOrders", JSON.stringify(updatedOrders))

    toast({
      title: "Pedido enviado",
      description: "Seu pedido foi enviado para a cozinha",
    })
    setOrderItems([])
    setTableResponsible("")
    setTableNumber("")
    setSeller("")
  }

  const renderMenuItem = (item: MenuItem) => (
    <Card key={item.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <CardTitle className="text-base">{item.name}</CardTitle>
        {item.description && (
          <CardDescription className="text-sm mt-1">
            {item.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-lg font-bold text-green-600 mb-2">€{item.price}</p>
        <div className="flex items-center justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuantityChange(item, -1)}
            className="bg-warning hover:bg-warning/90"
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
            className="bg-primary hover:bg-primary/90"
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

          {previousOrders.length > 0 && (
            <>
              <h2 className="text-2xl font-bold my-6">Pedidos Anteriores</h2>
              <div className="space-y-4">
                {previousOrders
                  .filter(order => order.status === "pending")
                  .map(order => (
                    <Card key={order.id} className="bg-gray-50">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">
                              Mesa {order.tableNumber}: {order.tableResponsible}
                            </CardTitle>
                            <CardDescription>
                              Vendedor: {order.seller}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {new Date(order.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          {order.items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <div className="flex-1">
                                <div>{item.name} x{item.quantity}</div>
                                {item.description && (
                                  <div className="text-xs text-muted-foreground">{item.description}</div>
                                )}
                              </div>
                              <span className="ml-4">€{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2 font-bold">
                            Total: €{order.total.toFixed(2)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <Input
                      placeholder="Número da Mesa"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <Input
                    placeholder="Responsável da mesa"
                    value={tableResponsible}
                    onChange={(e) => setTableResponsible(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Vendedor"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
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
                        {item.description && (
                          <p className="text-xs text-muted-foreground ml-8">{item.description}</p>
                        )}
                      </div>
                      <span className="ml-4">€{(item.price * item.quantity).toFixed(2)}</span>
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
