"use client";

import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Clock,
  RotateCw,
  User as UserIcon
} from 'lucide-react';
import { toast } from 'sonner';

export function CleaningDuty() {
  const { users, cleaningDuty, currentUser, markCleaningComplete } = useApp();

  if (!cleaningDuty) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">No cleaning duty schedule set up yet</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentTurnUser = users.find(u => u.id === cleaningDuty.currentTurn);
  const isMyTurn = currentUser?.id === cleaningDuty.currentTurn;

  const handleMarkComplete = () => {
    markCleaningComplete();
    toast.success('Cleaning duty marked as complete!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600';
      case 'Skipped':
        return 'text-orange-600';
      case 'Late':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="size-4" />;
      case 'Skipped':
        return <XCircle className="size-4" />;
      case 'Late':
        return <Clock className="size-4" />;
      default:
        return null;
    }
  };

  const completedCount = cleaningDuty.history.filter(h => h.status === 'Completed').length;
  const totalCount = cleaningDuty.history.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Cleaning Duty</h1>
        <p className="text-gray-600">Track and manage cleaning schedule</p>
      </div>

      {/* Current Turn */}
      <Card className={isMyTurn ? 'border-indigo-500 bg-indigo-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5" />
            Today&apos;s Turn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentTurnUser && (
                <>
                  <Avatar className="size-20">
                    <AvatarFallback>{currentTurnUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl">{currentTurnUser.name}</p>
                    <p className="text-sm text-gray-600">
                      {isMyTurn ? "It's your turn today!" : "It's their turn today"}
                    </p>
                    <Badge 
                      variant={currentTurnUser.presenceStatus === 'Present' ? 'default' : 'secondary'}
                      className="mt-2"
                    >
                      {currentTurnUser.presenceStatus}
                    </Badge>
                  </div>
                </>
              )}
            </div>
            {isMyTurn && (
              <Button onClick={handleMarkComplete} size="lg">
                <CheckCircle className="size-4 mr-2" />
                Mark as Done
              </Button>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-600">Frequency</p>
              <p className="text-sm mt-1">{cleaningDuty.frequency}</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-600">Last Cleaned</p>
              <p className="text-sm mt-1">
                {cleaningDuty.lastCleanedDate 
                  ? new Date(cleaningDuty.lastCleanedDate).toLocaleDateString() 
                  : 'Never'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Cleaning Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Overall Completion Rate</span>
                <span className="text-sm">{completionRate.toFixed(0)}%</span>
              </div>
              <Progress value={completionRate} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl text-green-600">
                  {cleaningDuty.history.filter(h => h.status === 'Completed').length}
                </p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl text-orange-600">
                  {cleaningDuty.history.filter(h => h.status === 'Skipped').length}
                </p>
                <p className="text-xs text-gray-600">Skipped</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl text-red-600">
                  {cleaningDuty.history.filter(h => h.status === 'Late').length}
                </p>
                <p className="text-xs text-gray-600">Late</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rotation Order */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCw className="size-5" />
            Rotation Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cleaningDuty.members.map((memberId, index) => {
              const user = users.find(u => u.id === memberId);
              const isCurrent = memberId === cleaningDuty.currentTurn;
              
              if (!user) return null;
              
              return (
                <div
                  key={memberId}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isCurrent ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center size-8 rounded-full bg-gray-100">
                    <span className="text-sm">{index + 1}</span>
                  </div>
                  <Avatar>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">{user.name}</p>
                    <Badge 
                      variant={user.presenceStatus === 'Present' ? 'default' : 'secondary'}
                      className="text-xs mt-1"
                    >
                      {user.presenceStatus}
                    </Badge>
                  </div>
                  {isCurrent && (
                    <Badge className="bg-indigo-600">Current Turn</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Cleaning History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cleaningDuty.history.slice(0, 10).map((entry, index) => {
              const user = users.find(u => u.id === entry.userId);
              
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback>
                        <UserIcon className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${getStatusColor(entry.status)}`}>
                    {getStatusIcon(entry.status)}
                    <span className="text-sm">{entry.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
