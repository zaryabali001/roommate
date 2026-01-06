/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Home, 
  Building,
  CheckCircle,
  LogOut
} from 'lucide-react';
import type { User } from '../types';
import { toast } from 'sonner';

export function Profile() {
  const { currentUser, updateUserPresence, logout } = useApp();
  const [presenceStatus, setPresenceStatus] = useState(currentUser?.presenceStatus || 'Present');

  if (!currentUser) return null;

  const handlePresenceChange = (status: User['presenceStatus']) => {
    setPresenceStatus(status);
    updateUserPresence(status);
    toast.success(`Status updated to ${status}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Profile</h1>
        <p className="text-gray-600">Manage your profile and presence status</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="size-32">
              <AvatarImage src={currentUser.profilePicture} />
              <AvatarFallback className="text-4xl">{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2>{currentUser.name}</h2>
              <p className="text-gray-600">{currentUser.email}</p>
              <Badge className="mt-2">{currentUser.role}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Presence Status */}
      <Card>
        <CardHeader>
          <CardTitle>Presence Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Status</Label>
            <Select value={presenceStatus} onValueChange={(v: any) => handlePresenceChange(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-600" />
                    Present
                  </div>
                </SelectItem>
                <SelectItem value="Out">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-orange-600" />
                    Out of Hostel
                  </div>
                </SelectItem>
                <SelectItem value="On-Leave">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-red-600" />
                    On Leave
                  </div>
                </SelectItem>
                <SelectItem value="Do-Not-Disturb">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-gray-600" />
                    Do Not Disturb
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              This affects cleaning duty rotation and notifications
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 border rounded-lg">
            <Mail className="size-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Email</p>
              <p>{currentUser.email}</p>
            </div>
          </div>

          {currentUser.phone && (
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Phone className="size-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Phone</p>
                <p>{currentUser.phone}</p>
              </div>
            </div>
          )}

          {currentUser.roomNumber && (
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Home className="size-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Room Number</p>
                <p>{currentUser.roomNumber}</p>
              </div>
            </div>
          )}

          {currentUser.hostelName && (
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Building className="size-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Hostel Name</p>
                <p>{currentUser.hostelName}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('Coming late notification sent!')}>
            <CheckCircle className="size-4 mr-2" />
            I&apos;m Coming Late
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('On the way notification sent!')}>
            <CheckCircle className="size-4 mr-2" />
            I&apos;m On The Way
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('Emergency alert sent!')}>
            <CheckCircle className="size-4 mr-2" />
            Emergency Alert
          </Button>
        </CardContent>
      </Card>

      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        <LogOut className="size-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
