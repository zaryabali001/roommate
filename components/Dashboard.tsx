/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  DollarSign, 
  CheckSquare, 
  Users, 
  Calendar,
  TrendingUp,
  AlertCircle,
  ShoppingCart,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export function Dashboard() {
  const { 
    currentUser, 
    users, 
    todos, 
    expenses, 
    shoppingItems,
    cleaningDuty,
    billReminders 
  } = useApp();

  // Calculate statistics
  const personalTodos = todos.filter((t: { groupId: any; completed: any; }) => !t.groupId && !t.completed);
  const groupTodos = todos.filter((t: { groupId: any; completed: any; }) => t.groupId && !t.completed);
  const completedTodos = todos.filter((t: { completed: any; }) => t.completed).length;
  const totalTodos = todos.length;
  const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  const totalOwed = expenses.reduce((acc: any, expense: { splitDetails: any[]; paidBy: any; }) => {
    const mySplit = expense.splitDetails.find(s => s.userId === currentUser?.id);
    if (mySplit && !mySplit.paid && expense.paidBy !== currentUser?.id) {
      return acc + mySplit.amount;
    }
    return acc;
  }, 0);

  const totalOwedToMe = expenses.reduce((acc: any, expense: { paidBy: any; splitDetails: any[]; }) => {
    if (expense.paidBy === currentUser?.id) {
      return acc + expense.splitDetails
        .filter(s => !s.paid && s.userId !== currentUser?.id)
        .reduce((sum, s) => sum + s.amount, 0);
    }
    return acc;
  }, 0);

  const pendingBills = billReminders.filter((b: { paid: any; }) => !b.paid);
  const unpurchasedItems = shoppingItems.filter((i: { purchased: any; }) => !i.purchased);

  const currentTurnUser = users.find((u: { id: any; }) => u.id === cleaningDuty?.currentTurn);

  const presentMembers = users.filter((u: { presenceStatus: string; }) => u.presenceStatus === 'Present').length;
  const totalMembers = users.length;

  const netBalance = totalOwedToMe - totalOwed;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 min-h-screen">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 md:p-8 text-white">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 size-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 size-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Welcome back,</p>
              <h1 className="text-3xl md:text-4xl text-white mb-2">
                {currentUser?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-white/90">Here's what's happening today</p>
            </div>
            <Avatar className="size-16 md:size-20 ring-4 ring-white/30">
              <AvatarImage src={currentUser?.profilePicture} />
              <AvatarFallback className="bg-white/20 backdrop-blur text-white text-2xl">
                {currentUser?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2 mt-6 bg-white/10 backdrop-blur w-fit px-4 py-2 rounded-full">
            <div className="size-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/90">
              {presentMembers}/{totalMembers} members present
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-green-50">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 md:p-3 bg-green-100 rounded-xl">
                <DollarSign className="size-4 md:size-5 text-green-600" />
              </div>
              {netBalance > 0 ? (
                <ArrowUpRight className="size-4 text-green-600" />
              ) : netBalance < 0 ? (
                <ArrowDownRight className="size-4 text-red-600" />
              ) : null}
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Balance</p>
            <div className={`text-xl md:text-2xl font-bold ${
              netBalance > 0 ? 'text-green-600' : netBalance < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              ₨ {Math.abs(netBalance).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {netBalance > 0 ? 'You get back' : netBalance < 0 ? 'You owe' : 'Settled'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-xl">
                <CheckSquare className="size-4 md:size-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Tasks</p>
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              {personalTodos.length + groupTodos.length}
            </div>
            <Progress value={completionRate} className="mt-2 h-1.5 bg-blue-100" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-orange-50">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 md:p-3 bg-orange-100 rounded-xl">
                <ShoppingCart className="size-4 md:size-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Shopping</p>
            <div className="text-xl md:text-2xl font-bold text-orange-600">
              {unpurchasedItems.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Items pending</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 md:p-3 bg-red-100 rounded-xl">
                <AlertCircle className="size-4 md:size-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Bills</p>
            <div className="text-xl md:text-2xl font-bold text-red-600">
              {pendingBills.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ₨ {pendingBills.reduce((sum: any, b: { amount: any; }) => sum + b.amount, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Today's Cleaning Duty */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="size-5" />
              Today's Cleaning Duty
            </CardTitle>
          </div>
          <CardContent className="p-4 md:p-6">
            {currentTurnUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16 md:size-20 ring-4 ring-purple-100">
                    <AvatarImage src={currentTurnUser.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                      {currentTurnUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{currentTurnUser.name}</p>
                    <p className="text-sm text-gray-600">It's their turn to clean</p>
                    <Badge 
                      variant={currentTurnUser.presenceStatus === 'Present' ? 'default' : 'secondary'}
                      className="mt-2"
                    >
                      {currentTurnUser.presenceStatus}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Frequency</p>
                    <p className="text-sm font-medium">{cleaningDuty?.frequency}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Last Cleaned</p>
                    <p className="text-sm font-medium">
                      {cleaningDuty?.lastCleanedDate 
                        ? new Date(cleaningDuty.lastCleanedDate).toLocaleDateString() 
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No cleaning duty assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Roommates Status */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="size-5" />
              Roommates
            </CardTitle>
          </div>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              {users.map((user: { id: React.Key | null | undefined; profilePicture: any; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; role: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; presenceStatus: string; }) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-cyan-50 transition-all">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 ring-2 ring-white">
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback className="bg-linear-to-br from-blue-500 to-cyan-500 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={user.presenceStatus === 'Present' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {user.presenceStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="size-5" />
              Upcoming Tasks
            </CardTitle>
          </div>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              {[...personalTodos, ...groupTodos].slice(0, 5).map(todo => (
                <div key={todo.id} className="flex items-start justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{todo.title}</p>
                    {todo.dueDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge variant={
                    todo.priority === 'High' ? 'destructive' :
                    todo.priority === 'Medium' ? 'default' : 'secondary'
                  } className="text-xs">
                    {todo.priority}
                  </Badge>
                </div>
              ))}
              {personalTodos.length + groupTodos.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No pending tasks</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="size-5" />
              Recent Expenses
            </CardTitle>
          </div>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense: { paidBy: any; splitDetails: any[]; id: React.Key | null | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; date: string | number | Date; amount: { toLocaleString: () => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; }) => {
                const paidBy = users.find((u: { id: any; }) => u.id === expense.paidBy);
                const mySplit = expense.splitDetails.find((s: { userId: any; }) => s.userId === currentUser?.id);
                
                return (
                  <div key={expense.id} className="flex items-start justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{expense.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {paidBy?.name} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">₨ {expense.amount.toLocaleString()}</p>
                      {mySplit && (
                        <p className={`text-xs ${mySplit.paid ? 'text-green-600' : 'text-orange-600'}`}>
                          You: ₨ {mySplit.amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {expenses.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No expenses yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}