
import { Clock, Calendar, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventType } from '@/pages/Index';

interface EventListProps {
  events: EventType[];
  onBookEvent: (eventId: string) => void;
}

const EventList = ({ events, onBookEvent }: EventListProps) => {
  const formatAvailability = (event: EventType) => {
    const availability = [];
    
    if (event.availability.weekdays.enabled) {
      availability.push(
        `Seg-Sex: ${event.availability.weekdays.startTime} às ${event.availability.weekdays.endTime}`
      );
    }
    
    if (event.availability.weekends.enabled) {
      availability.push(
        `Fins de semana: ${event.availability.weekends.startTime} às ${event.availability.weekends.endTime}`
      );
    }
    
    return availability.join(' • ');
  };

  const copyLinkToClipboard = (eventId: string) => {
    const url = `${window.location.origin}/#/book/${eventId}`;
    navigator.clipboard.writeText(url);
    // Here you could add a toast notification
    console.log('Link copiado:', url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {event.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  {event.description || 'Sem descrição'}
                </CardDescription>
              </div>
              <Badge variant="outline" className="ml-2">
                <Clock className="w-3 h-3 mr-1" />
                {event.duration}min
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                Disponibilidade:
              </h4>
              <p className="text-sm">
                {formatAvailability(event)}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Status:
              </h4>
              <div className="flex items-center gap-2">
                {event.availability.weekdays.enabled && (
                  <Badge variant="secondary">Dias úteis</Badge>
                )}
                {event.availability.weekends.enabled && (
                  <Badge variant="secondary">Fins de semana</Badge>
                )}
                {!event.availability.weekdays.enabled && !event.availability.weekends.enabled && (
                  <Badge variant="destructive">Inativo</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyLinkToClipboard(event.id)}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
              <Button
                size="sm"
                onClick={() => onBookEvent(event.id)}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventList;
