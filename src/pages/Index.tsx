import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, LogOut, Plus, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import EventList from "@/components/EventList";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface EventType {
  id: string;
  title: string;
  duration: number;
  description: string;
  availability: {
    weekdays: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
    weekends: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
    detailed?: Record<
      string,
      {
        enabled: boolean;
        startTime: string;
        endTime: string;
      }
    >;
  };
}

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [events] = useState<EventType[]>([
    {
      id: "1",
      title: "Consulta Rápida",
      duration: 30,
      description: "Conversa rápida de 30 minutos",
      availability: {
        weekdays: {
          enabled: true,
          startTime: "08:00",
          endTime: "12:00",
        },
        weekends: {
          enabled: false,
          startTime: "10:00",
          endTime: "13:00",
        },
      },
    },
    {
      id: "2",
      title: "Reunião de Fim de Semana",
      duration: 60,
      description: "Reunião mais longa para fins de semana",
      availability: {
        weekdays: {
          enabled: false,
          startTime: "09:00",
          endTime: "17:00",
        },
        weekends: {
          enabled: true,
          startTime: "10:00",
          endTime: "13:00",
        },
      },
    },
  ]);

  const handleBookEvent = (eventId: string) => {
    window.location.href = `/booking/${eventId}`;
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao tentar sair.",
        variant: "destructive",
      });
    }
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
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Meu Calendário</h1>
              <p className="text-muted-foreground">
                Bem-vindo, {getUserDisplayName(user?.email)} • Gerencie seus
                agendamentos pessoais
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/create-event">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials(user?.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getUserDisplayName(user?.email)}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tipos de Eventos
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {events.length}
              </div>
              <p className="text-xs text-muted-foreground">
                eventos configurados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Disponibilidade
              </CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {
                  events.filter(
                    (e) =>
                      e.availability.weekdays.enabled ||
                      e.availability.weekends.enabled
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">eventos ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Agendamentos
              </CardTitle>
              <User className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">0</div>
              <p className="text-xs text-muted-foreground">este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Seus Eventos</h2>
          </div>

          {events.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum evento criado
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Comece criando seu primeiro evento para começar a receber
                  agendamentos
                </p>
                <Link to="/create-event">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Evento
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <EventList events={events} onBookEvent={handleBookEvent} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
