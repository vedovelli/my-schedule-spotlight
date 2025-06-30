
import { useNavigate } from 'react-router-dom';
import EventCreator from '@/components/EventCreator';
import { EventType } from './Index';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleCreateEvent = (newEvent: Omit<EventType, 'id'>) => {
    // Aqui você salvaria o evento (por exemplo, em um contexto global ou API)
    console.log('Novo evento criado:', newEvent);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <EventCreator 
          onSave={handleCreateEvent}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
