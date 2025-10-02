import { Bell, Bug, HeartPulse, Pill, Syringe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const mockNotifications = [
  {
    pet: 'Buddy',
    event: 'Next Rabies vaccine',
    dueDate: 'in 3 days',
    icon: Syringe,
    color: 'text-blue-500',
  },
  {
    pet: 'Lucy',
    event: 'Next deworming (external)',
    dueDate: 'in 1 week',
    icon: Bug,
    color: 'text-green-500',
  },
  {
    pet: 'Buddy',
    event: 'Apoquel treatment ending',
    dueDate: 'in 10 days',
    icon: Pill,
    color: 'text-yellow-500',
  },
];

const reminderSettings = [
    { id: 'vaccine', label: 'Vaccination Reminders', icon: Syringe },
    { id: 'deworming', label: 'Deworming Reminders', icon: Bug },
    { id: 'treatment', label: 'Treatment Reminders', icon: Pill },
    { id: 'reproductive', label: 'Reproductive Event Logs', icon: HeartPulse },
]

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Reminders & Notifications</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Upcoming Reminders</CardTitle>
            <CardDescription>
                These are mock notifications for demonstration purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockNotifications.map((notif, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className={`mt-1 p-2 bg-secondary rounded-full`}>
                    <notif.icon className={`h-5 w-5 ${notif.color}`} />
                </div>
                <div>
                    <p className="font-semibold">{notif.pet}: <span className="font-normal">{notif.event}</span></p>
                    <p className="text-sm text-muted-foreground">{notif.dueDate}</p>
                </div>
              </div>
            ))}
             {mockNotifications.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No upcoming reminders.</p>
                </div>
             )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1 sticky top-20">
            <CardHeader>
                <CardTitle className="font-headline">Notification Settings</CardTitle>
                <CardDescription>
                    Manage what you get reminders for.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {reminderSettings.map((setting, index) => (
                    <React.Fragment key={setting.id}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <setting.icon className="h-4 w-4 mr-3 text-muted-foreground" />
                                <label htmlFor={setting.id} className="text-sm font-medium">
                                    {setting.label}
                                </label>
                            </div>
                            <Switch id={setting.id} defaultChecked={index < 2} />
                        </div>
                        {index < reminderSettings.length - 1 && <Separator />}
                    </React.Fragment>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
