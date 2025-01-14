import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

type TableStatus = "available" | "occupied" | "closing";

interface Table {
  id: number;
  status: TableStatus;
}

const Tables = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tables] = useState<Table[]>(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      status: "available" as TableStatus,
    }))
  );

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "available":
        return "bg-accent hover:bg-accent/90";
      case "occupied":
        return "bg-destructive hover:bg-destructive/90";
      case "closing":
        return "bg-warning hover:bg-warning/90";
      default:
        return "bg-gray-200";
    }
  };

  const handleTableClick = (tableId: number) => {
    // Agora navegamos diretamente para a rota /menu
    navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tables Overview</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">Welcome, {user?.name}</span>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {tables.map((table) => (
            <Button
              key={table.id}
              onClick={() => handleTableClick(table.id)}
              className={`h-24 ${getStatusColor(table.status)}`}
            >
              Table {table.id}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tables;