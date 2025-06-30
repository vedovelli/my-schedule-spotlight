import { Calendar, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { EventType } from '@/pages/Index';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  eventFormSchema,
  type EventFormData,
  type DayAvailabilityData,
  defaultEventFormValues,
} from '@/lib/validations/event-form';

interface EventCreatorProps {
  onSave: (event: Omit<EventType, 'id'>) => void;
  onCancel: () => void;
}

const EventCreator = ({ onSave, onCancel }: EventCreatorProps) => {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultEventFormValues,
    mode: 'onChange', // Validate on change for better UX
  });

  const dayLabels = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  const handleSubmit = (data: EventFormData) => {
    const { title, description, duration, weekdays } = data;

    // Convert the new format to the old format for compatibility
    const hasWeekdayEnabled = Object.entries(weekdays)
      .filter(([day]) => !['saturday', 'sunday'].includes(day))
      .some(([, config]) => config.enabled);

    const hasWeekendEnabled =
      weekdays.saturday.enabled || weekdays.sunday.enabled;

    // Find common time ranges for weekdays and weekends (simplified approach)
    const weekdayTimes = Object.entries(weekdays)
      .filter(
        ([day, config]) =>
          !['saturday', 'sunday'].includes(day) && config.enabled
      )
      .map(([, config]) => config);

    const weekendTimes = [weekdays.saturday, weekdays.sunday].filter(
      config => config.enabled
    );

    const newEvent: Omit<EventType, 'id'> = {
      title,
      description: description || '',
      duration,
      availability: {
        weekdays: {
          enabled: hasWeekdayEnabled,
          startTime:
            weekdayTimes.length > 0 ? weekdayTimes[0].startTime : '08:00',
          endTime: weekdayTimes.length > 0 ? weekdayTimes[0].endTime : '17:00',
        },
        weekends: {
          enabled: hasWeekendEnabled,
          startTime:
            weekendTimes.length > 0 ? weekendTimes[0].startTime : '10:00',
          endTime: weekendTimes.length > 0 ? weekendTimes[0].endTime : '13:00',
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
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const watchedWeekdays = form.watch('weekdays');
  const anyDayEnabled = Object.values(watchedWeekdays).some(day => day.enabled);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Evento *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Consulta Rápida" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome que será exibido para os visitantes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva brevemente o que será tratado neste evento"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Informações adicionais sobre o evento (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (minutos)</FormLabel>
                      <Select
                        onValueChange={value => field.onChange(parseInt(value))}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="45">45 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="90">1h 30min</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Tempo de duração do evento
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    <FormField
                      control={form.control}
                      name={`weekdays.${dayKey}.enabled` as const}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm font-medium">
                              {dayLabel}
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchedWeekdays[dayKey as keyof typeof watchedWeekdays]
                      ?.enabled && (
                      <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-primary/20">
                        <FormField
                          control={form.control}
                          name={`weekdays.${dayKey}.startTime` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-muted-foreground">
                                Início
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {timeOptions.map(time => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`weekdays.${dayKey}.endTime` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-muted-foreground">
                                Fim
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {timeOptions.map(time => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* General weekdays validation message */}
                <FormField
                  control={form.control}
                  name="weekdays"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              disabled={form.formState.isSubmitting || !anyDayEnabled}
            >
              {form.formState.isSubmitting ? 'Criando...' : 'Criar Evento'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventCreator;
