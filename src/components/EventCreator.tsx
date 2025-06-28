import { ArrowLeft, Calendar, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { EventType } from "@/pages/Index";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface EventCreatorProps {
  onSave: (event: Omit<EventType, "id">) => void;
  onCancel: () => void;
}

interface DayAvailability {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const EventCreator = ({ onSave, onCancel }: EventCreatorProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);

  const [weekdays, setWeekdays] = useState<Record<string, DayAvailability>>({
    monday: { enabled: false, startTime: "08:00", endTime: "17:00" },
    tuesday: { enabled: false, startTime: "08:00", endTime: "17:00" },
    wednesday: { enabled: false, startTime: "08:00", endTime: "17:00" },
    thursday: { enabled: false, startTime: "08:00", endTime: "17:00" },
    friday: { enabled: false, startTime: "08:00", endTime: "17:00" },
    saturday: { enabled: false, startTime: "10:00", endTime: "13:00" },
    sunday: { enabled: false, startTime: "10:00", endTime: "13:00" },
  });

  const dayLabels = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    // Convert the new format to the old format for compatibility
    const hasWeekdayEnabled = Object.entries(weekdays)
      .filter(([day]) => !["saturday", "sunday"].includes(day))
      .some(([, config]) => config.enabled);

    const hasWeekendEnabled =
      weekdays.saturday.enabled || weekdays.sunday.enabled;

    // Find common time ranges for weekdays and weekends (simplified approach)
    const weekdayTimes = Object.entries(weekdays)
      .filter(
        ([day, config]) =>
          !["saturday", "sunday"].includes(day) && config.enabled
      )
      .map(([, config]) => config);

    const weekendTimes = [weekdays.saturday, weekdays.sunday].filter(
      (config) => config.enabled
    );

    const newEvent: Omit<EventType, "id"> = {
      title,
      description,
      duration,
      availability: {
        weekdays: {
          enabled: hasWeekdayEnabled,
          startTime:
            weekdayTimes.length > 0 ? weekdayTimes[0].startTime : "08:00",
          endTime: weekdayTimes.length > 0 ? weekdayTimes[0].endTime : "17:00",
        },
        weekends: {
          enabled: hasWeekendEnabled,
          startTime:
            weekendTimes.length > 0 ? weekendTimes[0].startTime : "10:00",
          endTime: weekendTimes.length > 0 ? weekendTimes[0].endTime : "13:00",
        },
        // Store detailed day configuration
        detailed: weekdays,
      },
    };

    onSave(newEvent);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const updateDayAvailability = (
    day: string,
    field: keyof DayAvailability,
    value: boolean | string
  ) => {
    setWeekdays((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const anyDayEnabled = Object.values(weekdays).some((day) => day.enabled);

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Defina as informações principais do seu evento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Evento *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Consulta Rápida"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva brevemente o que será tratado neste evento"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Select
                  value={duration.toString()}
                  onValueChange={(value) => setDuration(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="90">1h 30min</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Disponibilidade por Dia
              </CardTitle>
              <CardDescription>
                Configure sua disponibilidade para cada dia da semana
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(dayLabels).map(([dayKey, dayLabel]) => (
                <div key={dayKey} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">{dayLabel}</Label>
                    </div>
                    <Switch
                      checked={weekdays[dayKey].enabled}
                      onCheckedChange={(checked) =>
                        updateDayAvailability(dayKey, "enabled", checked)
                      }
                    />
                  </div>

                  {weekdays[dayKey].enabled && (
                    <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-primary/20">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Início
                        </Label>
                        <Select
                          value={weekdays[dayKey].startTime}
                          onValueChange={(value) =>
                            updateDayAvailability(dayKey, "startTime", value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Fim
                        </Label>
                        <Select
                          value={weekdays[dayKey].endTime}
                          onValueChange={(value) =>
                            updateDayAvailability(dayKey, "endTime", value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={!title.trim() || !anyDayEnabled}
          >
            Criar Evento
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventCreator;
