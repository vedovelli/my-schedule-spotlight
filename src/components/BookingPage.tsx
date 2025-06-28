
import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { EventType } from '@/pages/Index';

interface BookingPageProps {
  event: EventType;
  onBack: () => void;
}

const BookingPage = ({ event, onBack }: BookingPageProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isWeekday = !isWeekend;
      
      if ((isWeekday && event.availability.weekdays.enabled) || 
          (isWeekend && event.availability.weekends.enabled)) {
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('pt-BR', { 
            weekday: 'short', 
            day: '2-digit', 
            month: '2-digit' 
          }),
          isWeekend
        });
      }
    }
    
    return dates;
  };

  const generateAvailableTimes = (isWeekend: boolean) => {
    const availability = isWeekend ? event.availability.weekends : event.availability.weekdays;
    if (!availability.enabled) return [];

    const times = [];
    const startHour = parseInt(availability.startTime.split(':')[0]);
    const startMinute = parseInt(availability.startTime.split(':')[1]);
    const endHour = parseInt(availability.endTime.split(':')[0]);
    const endMinute = parseInt(availability.endTime.split(':')[1]);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    for (let time = startTime; time < endTime; time += 30) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }

    return times;
  };

  const availableDates = generateAvailableDates();
  const selectedDateObj = availableDates.find(d => d.date === selectedDate);
  const availableTimes = selectedDateObj ? generateAvailableTimes(selectedDateObj.isWeekend) : [];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !customerName || !customerEmail) {
      return;
    }

    // Simulate booking process
    setTimeout(() => {
      setIsBooked(true);
    }, 1000);
  };

  if (isBooked) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Agendamento Confirmado!</h2>
            <p className="text-muted-foreground mb-6">
              Seu agendamento foi realizado com sucesso. Você receberá um email com os detalhes.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">Detalhes do Agendamento:</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Evento:</strong> {event.title}</p>
                <p><strong>Data:</strong> {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {selectedTime}</p>
                <p><strong>Duração:</strong> {event.duration} minutos</p>
                <p><strong>Nome:</strong> {customerName}</p>
                <p><strong>Email:</strong> {customerEmail}</p>
              </div>
            </div>

            <Button onClick={onBack} variant="outline">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Agendar: {event.title}</h1>
          <p className="text-muted-foreground">Escolha um horário disponível</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Detalhes do Evento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              {event.description && (
                <p className="text-muted-foreground text-sm mt-1">{event.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm">{event.duration} minutos</span>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Disponibilidade:</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                {event.availability.weekdays.enabled && (
                  <p>Segunda a Sexta: {event.availability.weekdays.startTime} às {event.availability.weekdays.endTime}</p>
                )}
                {event.availability.weekends.enabled && (
                  <p>Fins de semana: {event.availability.weekends.startTime} às {event.availability.weekends.endTime}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Fazer Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBooking} className="space-y-4">
              {/* Date Selection */}
              <div>
                <Label>Escolha uma data</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableDates.map((dateOption) => (
                    <Button
                      key={dateOption.date}
                      type="button"
                      variant={selectedDate === dateOption.date ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedDate(dateOption.date);
                        setSelectedTime('');
                      }}
                      className={selectedDate === dateOption.date ? "bg-primary hover:bg-primary/90" : ""}
                    >
                      {dateOption.display}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <Label>Escolha um horário</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={selectedTime === time ? "bg-primary hover:bg-primary/90" : ""}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Information */}
              {selectedTime && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Alguma informação adicional..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!customerName || !customerEmail}
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;
