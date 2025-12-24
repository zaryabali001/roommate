/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plus,
  Search,
  MapPin,
  AlertTriangle,
  Megaphone,
  FileText,
  Bell,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import type { LostAndFound, Notice } from '../types';

export function MorePage() {
  const { 
    lostAndFound, 
    notices, 
    documents, 
    billReminders, 
    currentUser,
    addLostAndFound,
    addNotice 
  } = useApp();

  const [lostFoundOpen, setLostFoundOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [lfTitle, setLfTitle] = useState('');
  const [lfDescription, setLfDescription] = useState('');
  const [lfType, setLfType] = useState<'Lost' | 'Found'>('Lost');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePriority, setNoticePriority] = useState<Notice['priority']>('Normal');

  const handleAddLostFound = () => {
    if (!lfTitle.trim() || !lfDescription.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    addLostAndFound({
      title: lfTitle,
      description: lfDescription,
      type: lfType,
      date: new Date(),
      postedBy: currentUser?.id || '',
      resolved: false,
    });

    toast.success(`${lfType} item posted successfully!`);
    setLfTitle('');
    setLfDescription('');
    setLostFoundOpen(false);
  };

  const handleAddNotice = () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    addNotice({
      title: noticeTitle,
      content: noticeContent,
      postedBy: currentUser?.id || '',
      date: new Date(),
      priority: noticePriority,
    });

    toast.success('Notice posted successfully!');
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>More</h1>
        <p className="text-gray-600">Additional features and information</p>
      </div>

      <Tabs defaultValue="lost-found">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
        </TabsList>

        {/* Lost & Found */}
        <TabsContent value="lost-found" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={lostFoundOpen} onOpenChange={setLostFoundOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4 mr-2" />
                  Post Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Post Lost/Found Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={lfType} onValueChange={(v: any) => setLfType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lost">Lost</SelectItem>
                        <SelectItem value="Found">Found</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Item Title</Label>
                    <Input
                      placeholder="e.g., Black Umbrella"
                      value={lfTitle}
                      onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setLfTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Provide details about the item"
                      value={lfDescription}
                      onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setLfDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleAddLostFound} className="w-full">
                    Post Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {lostAndFound.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-gray-500">No lost or found items</p>
              </CardContent>
            </Card>
          ) : (
            lostAndFound.map((item: { id: any; type: string; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; date: string | number | Date; }) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'Lost' ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      {item.type === 'Lost' ? (
                        <Search className="size-5 text-orange-600" />
                      ) : (
                        <MapPin className="size-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p>{item.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Posted {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={item.type === 'Lost' ? 'destructive' : 'default'}>
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Notices */}
        <TabsContent value="notices" className="space-y-4">
          <div className="flex justify-end">
            {currentUser?.role === 'Admin' && (
              <Dialog open={noticeOpen} onOpenChange={setNoticeOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="size-4 mr-2" />
                    Post Notice
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Post Notice</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="Notice title"
                        value={noticeTitle}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNoticeTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea
                        placeholder="Notice details"
                        value={noticeContent}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNoticeContent(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={noticePriority} onValueChange={(v: any) => setNoticePriority(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Important">Important</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddNotice} className="w-full">
                      Post Notice
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {notices.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-gray-500">No notices</p>
              </CardContent>
            </Card>
          ) : (
            notices.map((notice: { id: any; priority: string; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; content: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; date: string | number | Date; }) => (
              <Card key={notice.id} className={
                notice.priority === 'Urgent' ? 'border-red-500' :
                notice.priority === 'Important' ? 'border-orange-500' : ''
              }>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      notice.priority === 'Urgent' ? 'bg-red-100' :
                      notice.priority === 'Important' ? 'bg-orange-100' :
                      'bg-blue-100'
                    }`}>
                      <Megaphone className={`size-5 ${
                        notice.priority === 'Urgent' ? 'text-red-600' :
                        notice.priority === 'Important' ? 'text-orange-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p>{notice.title}</p>
                          <p className="text-sm text-gray-600 mt-2">{notice.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Posted {new Date(notice.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          notice.priority === 'Urgent' ? 'destructive' :
                          notice.priority === 'Important' ? 'default' :
                          'secondary'
                        }>
                          {notice.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => toast.info('Document upload feature - connect storage service')}>
              <Plus className="size-4 mr-2" />
              Upload Document
            </Button>
          </div>

          {documents.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-gray-500">No documents uploaded</p>
              </CardContent>
            </Card>
          ) : (
            documents.map((doc: { id: any; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; uploadedAt: string | number | Date; type: any; }) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <FileText className="size-5 text-indigo-600" />
                      </div>
                      <div>
                        <p>{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{doc.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Bill Reminders */}
        <TabsContent value="bills" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => toast.info('Add bill reminder')}>
              <Plus className="size-4 mr-2" />
              Add Bill
            </Button>
          </div>

          {billReminders.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-gray-500">No bill reminders</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {billReminders.map((bill: { dueDate: string | number | Date; paid: any; id: any; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; amount: { toLocaleString: () => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; }) => {
                const isOverdue = new Date(bill.dueDate) < new Date() && !bill.paid;
                const daysUntilDue = Math.ceil(
                  (new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <Card key={bill.id} className={isOverdue ? 'border-red-500' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            bill.paid ? 'bg-green-100' : isOverdue ? 'bg-red-100' : 'bg-orange-100'
                          }`}>
                            {bill.paid ? (
                              <Bell className="size-5 text-green-600" />
                            ) : (
                              <AlertCircle className="size-5 text-orange-600" />
                            )}
                          </div>
                          <div>
                            <p>{bill.title}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              ₨ {bill.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                              {!bill.paid && daysUntilDue > 0 && ` (${daysUntilDue} days)`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge variant={bill.paid ? 'default' : isOverdue ? 'destructive' : 'secondary'}>
                            {bill.paid ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                          </Badge>
                          {!bill.paid && (
                            <Button size="sm" className="w-full" onClick={() => toast.success('Bill marked as paid!')}>
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}