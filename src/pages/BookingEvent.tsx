import { useParams, useNavigate } from 'react-router-dom';
import BookingPage from '@/components/BookingPage';
import { EventType } from './Index';

const BookingEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Aqui você buscaria o evento real de uma API ou contexto global
  // Por enquanto, vou usar dados mockados
  const mockEvents: EventType[] = [
    {
      id: '1',
      title: 'Consulta Rápida',
      duration: 30,
      description: 'Conversa rápida de 30 minutos',
      availability: {
        weekdays: {
          enabled: true,
          startTime: '08:00',
          endTime: '12:00',
        },
        weekends: {
          enabled: false,
          startTime: '10:00',
          endTime: '13:00',
        },
      },
    },
    {
      id: '2',
      title: 'Reunião de Fim de Semana',
      duration: 60,
      description: 'Reunião mais longa para fins de semana',
      availability: {
        weekdays: {
          enabled: false,
          startTime: '09:00',
          endTime: '17:00',
        },
        weekends: {
          enabled: true,
          startTime: '10:00',
          endTime: '13:00',
        },
      },
    },
  ];

  const selectedEvent = mockEvents.find(e => e.id === eventId);

  const handleBack = () => {
    navigate('/');
  };

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
          <button onClick={handleBack} className="text-primary hover:underline">
            Voltar ao dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BookingPage event={selectedEvent} onBack={handleBack} />
    </div>
  );
};

export default BookingEvent;
