
import { useState } from 'react';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventType } from '@/pages/Index';

interface EventCreatorProps {
  onSave: (event: Omit<EventType, 'id'>) => void;
  onCancel: () => void;
}

const EventCreator = ({ onSave, onCancel }: EventCreatorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [weekdaysEnabled, setWeekdaysEnabled] = useState(true);
  const [weekdaysStart, setWeekdaysStart] = useState('08:00');
  const [weekdaysEnd, setWeekdaysEnd] = useState('17:00');
  const [weekendsEnabled, setWeekendsEnabled] = useState(false);
  const [weekendsStart, setWeekendsStart] = useState('10:00');
  const [weekendsEnd, setWeekendsEnd] = useState('13:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const newEvent: Omit<EventType, 'id'> = {
      title,
      description,
      duration,
      availability: {
        weekdays: {
          enabled: weekdaysEnabled,
          startTime: weekdaysStart,
          endTime: weekdaysEnd
        },
        weekends: {
          enabled: weekendsEnabled,
          startTime: weekendsStart,
          endTime: weekendsEnd
        }
      }
    };

    onSave(newEvent);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Criar Novo Evento</h1>
          <p className="text-muted-foreground">Configure seu novo tipo de evento</p>
        </div>
      </div>

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
                <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
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
                Disponibilidade
              </CardTitle>
              <CardDescription>
                Configure quando você estará disponível para este evento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Weekdays */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Segunda a Sexta</Label>
                    <p className="text-sm text-muted-foreground">Dias úteis da semana</p>
                  </div>
                  <Switch
                    checked={weekdaysEnabled}
                    onCheckedChange={setWeekdaysEnabled}
                  />
                </div>

                {weekdaysEnabled && (
                  <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
                    <div>
                      <Label>Início</Label>
                      <Select value={weekdaysStart} onValueChange={setWeekdaysStart}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Fim</Label>
                      <Select value={weekdaysEnd} onValueChange={setWeekdaysEnd}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Weekends */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Fins de Semana</Label>
                    <p className="text-sm text-muted-foreground">Sábado e domingo</p>
                  </div>
                  <Switch
                    checked={weekendsEnabled}
                    onCheckedChange={setWeekendsEnabled}
                  />
                </div>

                {weekendsEnabled && (
                  <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
                    <div>
                      <Label>Início</Label>
                      <Select value={weekendsStart} onValueChange={setWeekendsStart}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Fim</Label>
                      <Select value={weekendsEnd} onValueChange={setWeekendsEnd}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
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
            disabled={!title.trim() || (!weekdaysEnabled && !weekendsEnabled)}
          >
            Criar Evento
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventCreator;
