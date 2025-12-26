/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar as CalendarIcon, 
  Trash2,
  AlertCircle,
  Users,
  User
} from 'lucide-react';
import { format } from 'date-fns';

export function TodosPage() {
  const { todos, currentUser, users, group, addTodo, toggleTodo } = useApp();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [isGroupTask, setIsGroupTask] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);

  const personalTodos = todos.filter(t => !t.groupId);
  const groupTodos = todos.filter(t => t.groupId);

  const handleAddTodo = () => {
    if (!title.trim()) return;

    addTodo({
      title,
      description,
      dueDate,
      priority,
      completed: false,
      groupId: isGroupTask ? group?.id : undefined,
      assignedTo: isGroupTask && assignedUsers.length > 0 ? assignedUsers : undefined,
      createdBy: currentUser?.id || '',
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate(undefined);
    setPriority('Medium');
    setIsGroupTask(false);
    setAssignedUsers([]);
    setOpen(false);
  };

  const TodoItem = ({ todo }: { todo: typeof todos[0] }) => {
    const assignedPeople = todo.assignedTo?.map(id => users.find(u => u.id === id)?.name).filter(Boolean);
    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-white border-2 border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all">
        <button
          onClick={() => toggleTodo(todo.id)}
          className="mt-1"
        >
          {todo.completed ? (
            <CheckCircle2 className="size-5 text-green-600" />
          ) : (
            <Circle className="size-5 text-gray-400 hover:text-indigo-600 transition-colors" />
          )}
        </button>
        <div className="flex-1">
          <p className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </p>
          {todo.description && (
            <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {todo.dueDate && (
              <Badge variant={isOverdue ? 'destructive' : 'secondary'} className="text-xs">
                <CalendarIcon className="size-3 mr-1" />
                {format(new Date(todo.dueDate), 'MMM dd')}
              </Badge>
            )}
            <Badge 
              variant={
                todo.priority === 'High' ? 'destructive' :
                todo.priority === 'Medium' ? 'default' : 'secondary'
              }
              className="text-xs"
            >
              {todo.priority}
            </Badge>
            {assignedPeople && assignedPeople.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <Users className="size-3 mr-1" />
                {assignedPeople.join(', ')}
              </Badge>
            )}
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="size-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1>Tasks</h1>
          <p className="text-gray-600">Manage your personal and group tasks</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
              <Plus className="size-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add more details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="size-4 mr-2" />
                        {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-indigo-50 rounded-lg">
                <Checkbox
                  id="group-task"
                  checked={isGroupTask}
                  onCheckedChange={(checked) => setIsGroupTask(checked as boolean)}
                />
                <Label htmlFor="group-task" className="font-medium">Make this a group task</Label>
              </div>
              {isGroupTask && (
                <div className="space-y-2">
                  <Label>Assign To (Optional)</Label>
                  <div className="space-y-2 border rounded-lg p-3 max-h-40 overflow-y-auto">
                    {users
                      .filter(u => u.id !== currentUser?.id)
                      .map(user => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={assignedUsers.includes(user.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAssignedUsers([...assignedUsers, user.id]);
                              } else {
                                setAssignedUsers(assignedUsers.filter(id => id !== user.id));
                              }
                            }}
                          />
                          <Label htmlFor={`user-${user.id}`} className="text-sm">
                            {user.name}
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              <Button onClick={handleAddTodo} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-4">
            <p className="text-xs text-white/80 mb-1">Personal</p>
            <p className="text-2xl font-bold">{personalTodos.filter(t => !t.completed).length}</p>
            <p className="text-xs text-white/80 mt-1">Active</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <CardContent className="p-4">
            <p className="text-xs text-white/80 mb-1">Group</p>
            <p className="text-2xl font-bold">{groupTodos.filter(t => !t.completed).length}</p>
            <p className="text-xs text-white/80 mt-1">Active</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <p className="text-xs text-white/80 mb-1">Completed</p>
            <p className="text-2xl font-bold">{todos.filter(t => t.completed).length}</p>
            <p className="text-xs text-white/80 mt-1">Tasks</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-amber-600 text-white">
          <CardContent className="p-4">
            <p className="text-xs text-white/80 mb-1">Total</p>
            <p className="text-2xl font-bold">{todos.length}</p>
            <p className="text-xs text-white/80 mt-1">Tasks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-white shadow-md">
          <TabsTrigger value="personal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            <User className="size-4 mr-2" />
            Personal ({personalTodos.filter(t => !t.completed).length})
          </TabsTrigger>
          <TabsTrigger value="group" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
            <Users className="size-4 mr-2" />
            Group ({groupTodos.filter(t => !t.completed).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
              <CardTitle className="text-white flex items-center gap-2">
                <User className="size-5" />
                My Personal Tasks
              </CardTitle>
            </div>
            <CardContent className="p-4 md:p-6 space-y-3">
              {personalTodos.filter(t => !t.completed).length === 0 ? (
                <p className="text-gray-500 text-center py-12">No active tasks. Great job!</p>
              ) : (
                personalTodos.filter(t => !t.completed).map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))
              )}
            </CardContent>
          </Card>

          {personalTodos.filter(t => t.completed).length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Completed Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {personalTodos.filter(t => t.completed).map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="group" className="space-y-4">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="size-5" />
                Group Tasks
              </CardTitle>
            </div>
            <CardContent className="p-4 md:p-6 space-y-3">
              {groupTodos.filter(t => !t.completed).length === 0 ? (
                <p className="text-gray-500 text-center py-12">No active group tasks</p>
              ) : (
                groupTodos.filter(t => !t.completed).map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))
              )}
            </CardContent>
          </Card>

          {groupTodos.filter(t => t.completed).length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Completed Group Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupTodos.filter(t => t.completed).map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}