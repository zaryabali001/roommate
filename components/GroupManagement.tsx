/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  Users, 
  Plus, 
  Copy,
  Mail,
  Link as LinkIcon,
  UserPlus,
  Crown,
  
} from 'lucide-react';
import { toast } from 'sonner';

export function GroupManagement() {
  const { group, users, currentUser } = useApp();
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    toast.success('Group created successfully!');
    setGroupName('');
    setOpen(false);
  };

  const handleCopyInviteCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      toast.success('Invite code copied to clipboard!');
    }
  };

  const handleCopyInviteLink = () => {
    if (group?.inviteCode) {
      const link = `https://roommateapp.com/join/${group.inviteCode}`;
      navigator.clipboard.writeText(link);
      toast.success('Invite link copied to clipboard!');
    }
  };

  const handleSendEmailInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    toast.success(`Invitation sent to ${inviteEmail}!`);
    setInviteEmail('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Group Management</h1>
          <p className="text-gray-600">Manage your roommate group</p>
        </div>
        {!group && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Plus className="size-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Group Name</Label>
                  <Input
                    placeholder="e.g., Room 101, Flat #3"
                    value={groupName}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setGroupName(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateGroup} className="w-full">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {group ? (
        <div className="space-y-6">
          {/* Group Info Card */}
          <Card className="border-2 border-indigo-200 bg-linear-to-br from-indigo-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl">
                  <Users className="size-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl">{group.name}</h2>
                  <p className="text-sm text-gray-600">{group.members.length} members</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white/70 backdrop-blur rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Invite Code</p>
                  <div className="flex items-center justify-between">
                    <code className="font-mono font-semibold text-indigo-600">{group.inviteCode}</code>
                    <Button size="sm" variant="ghost" onClick={handleCopyInviteCode}>
                      <Copy className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3 bg-white/70 backdrop-blur rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Created</p>
                  <p className="text-sm font-medium">{new Date(group.members[0]?.joinedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invite Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="size-5" />
                Invite Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="code">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="link">Link</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>

                <TabsContent value="code" className="space-y-3">
                  <p className="text-sm text-gray-600">Share this code with your roommates</p>
                  <div className="flex gap-2">
                    <Input
                      value={group.inviteCode}
                      readOnly
                      className="font-mono text-lg text-center"
                    />
                    <Button onClick={handleCopyInviteCode}>
                      <Copy className="size-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="link" className="space-y-3">
                  <p className="text-sm text-gray-600">Share this link to invite members</p>
                  <div className="flex gap-2">
                    <Input
                      value={`roommateapp.com/join/${group.inviteCode}`}
                      readOnly
                      className="text-sm"
                    />
                    <Button onClick={handleCopyInviteLink}>
                      <LinkIcon className="size-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-3">
                  <p className="text-sm text-gray-600">Send invitation via email</p>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="friend@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <Button onClick={handleSendEmailInvite}>
                      <Mail className="size-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Members List */}
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {users.map((user) => {
                const member = group.members.find((m: { userId: any; }) => m.userId === user.id);
                const isAdmin = member?.role === 'Admin';
                
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-linear-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12 ring-2 ring-white">
                        <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-500 text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.name}</p>
                          {isAdmin && (
                            <Crown className="size-4 text-yellow-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{user.email}</p>
                        <Badge 
                          variant={user.presenceStatus === 'Present' ? 'default' : 'secondary'}
                          className="mt-1 text-xs"
                        >
                          {user.presenceStatus}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={isAdmin ? 'default' : 'secondary'}>
                      {member?.role}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="py-16 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-6 bg-gray-100 rounded-full">
                <Users className="size-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl mb-2">No Group Yet</h3>
            <p className="text-gray-600 mb-6">Create or join a group to start managing with roommates</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => setOpen(true)} className="bg-linear-to-r from-indigo-600 to-purple-600">
                <Plus className="size-4 mr-2" />
                Create Group
              </Button>
              <Button variant="outline" onClick={() => toast.info('Enter invite code to join')}>
                <UserPlus className="size-4 mr-2" />
                Join Group
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
