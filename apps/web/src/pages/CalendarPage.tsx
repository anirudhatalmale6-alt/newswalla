import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import api from '../api/client';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  status: string;
  platforms: string[];
}

const statusColors: Record<string, string> = {
  published: 'bg-green-100 text-green-700 border-green-200',
  scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const start = startOfMonth(currentMonth).toISOString();
    const end = endOfMonth(currentMonth).toISOString();
    api.get('/calendar', { params: { start, end } })
      .then(r => setEvents(r.data))
      .catch(() => {});
  }, [currentMonth]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDay = startOfMonth(currentMonth).getDay();

  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.start?.startsWith(dateStr));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="px-3 py-3 text-xs font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {/* Empty cells for start offset */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[120px] border-b border-r border-gray-100 bg-gray-50" />
          ))}

          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] border-b border-r border-gray-100 p-2 ${
                  !isSameMonth(day, currentMonth) ? 'bg-gray-50' : ''
                }`}
              >
                <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-sm ${
                  isToday(day) ? 'bg-brand-600 text-white font-bold' : 'text-gray-700'
                }`}>
                  {format(day, 'd')}
                </span>
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={`px-2 py-1 rounded text-xs border truncate cursor-pointer ${
                        statusColors[event.status] || statusColors.draft
                      }`}
                    >
                      {event.title || 'Untitled'}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-xs text-gray-400">+{dayEvents.length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
