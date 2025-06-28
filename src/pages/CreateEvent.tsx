import { ArrowLeft, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import EventCreator from "@/components/EventCreator";
import { EventType } from "./Index";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreateEvent = (newEvent: Omit<EventType, "id">) => {
    // Aqui você salvaria o evento (por exemplo, em um contexto global ou API)
    console.log("Novo evento criado:", newEvent);
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  const getUserInitials = (email?: string) => {
    if (!email) return "U";
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const getUserDisplayName = (email?: string) => {
    if (!email) return "Usuário";
    const username = email.split("@")[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header with user info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Criar Novo Evento</h1>
              <p className="text-muted-foreground">
                Configure seu novo tipo de evento
              </p>
            </div>
          </div>

          {/* User indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">
                {getUserDisplayName(user?.email)}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getUserInitials(user?.email)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <EventCreator onSave={handleCreateEvent} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default CreateEvent;
