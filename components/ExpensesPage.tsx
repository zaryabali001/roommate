/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  DollarSign, 
  Users, 
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';
import type { Expense } from '../types';

export function ExpensesPage() {
  const { expenses, users, currentUser, group, addExpense, settleExpense } = useApp();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Food');
  const [splitType, setSplitType] = useState<'Equal' | 'Custom'>('Equal');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleAddExpense = () => {
    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const totalAmount = parseFloat(amount);
    const usersToSplit = selectedUsers.length > 0 ? selectedUsers : users.map(u => u.id);
    const splitAmount = totalAmount / usersToSplit.length;

    addExpense({
      title,
      amount: totalAmount,
      category,
      splitType,
      splitDetails: usersToSplit.map(userId => ({
        userId,
        amount: splitAmount,
        paid: userId === currentUser?.id,
        paidDate: userId === currentUser?.id ? new Date() : undefined,
      })),
      paidBy: currentUser?.id || '',
      groupId: group?.id || '',
      date: new Date(),
      settled: false,
    });

    toast.success('Expense added successfully!');
    setTitle('');
    setAmount('');
    setCategory('Food');
    setSelectedUsers([]);
    setOpen(false);
  };

  const handleSettle = (expenseId: string) => {
    if (!currentUser) return;
    settleExpense(expenseId, currentUser.id);
    toast.success('Payment marked as settled!');
  };

  // Calculate balances
  const myBalance = expenses.reduce((acc, expense) => {
    const mySplit = expense.splitDetails.find(s => s.userId === currentUser?.id);
    
    if (expense.paidBy === currentUser?.id) {
      // Money owed to me
      const owedToMe = expense.splitDetails
        .filter(s => !s.paid && s.userId !== currentUser?.id)
        .reduce((sum, s) => sum + s.amount, 0);
      return acc + owedToMe;
    } else if (mySplit && !mySplit.paid) {
      // Money I owe
      return acc - mySplit.amount;
    }
    
    return acc;
  }, 0);

  const balances = users.map(user => {
    const balance = expenses.reduce((acc, expense) => {
      const userSplit = expense.splitDetails.find(s => s.userId === user.id);
      
      if (expense.paidBy === user.id) {
        const owedToUser = expense.splitDetails
          .filter(s => !s.paid && s.userId !== user.id)
          .reduce((sum, s) => sum + s.amount, 0);
        return acc + owedToUser;
      } else if (userSplit && !userSplit.paid) {
        return acc - userSplit.amount;
      }
      
      return acc;
    }, 0);
    
    return { user, balance };
  }).sort((a, b) => b.balance - a.balance);

  const ExpenseCard = ({ expense }: { expense: Expense }) => {
    const paidBy = users.find(u => u.id === expense.paidBy);
    const mySplit = expense.splitDetails.find(s => s.userId === currentUser?.id);
    const iPaid = expense.paidBy === currentUser?.id;
    const pendingCount = expense.splitDetails.filter(s => !s.paid).length;

    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Receipt className="size-5 text-indigo-600" />
              </div>
              <div>
                <p>{expense.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {expense.category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p>₨ {expense.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <p className="text-sm text-gray-600">
              Paid by {iPaid ? 'you' : paidBy?.name}
            </p>
            {mySplit && (
              <div className={`flex items-center justify-between p-2 rounded ${
                mySplit.paid ? 'bg-green-50' : 'bg-orange-50'
              }`}>
                <span className="text-sm">Your share</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">₨ {mySplit.amount.toLocaleString()}</span>
                  {mySplit.paid ? (
                    <CheckCircle className="size-4 text-green-600" />
                  ) : (
                    <XCircle className="size-4 text-orange-600" />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {expense.splitDetails.map(split => {
              const user = users.find(u => u.id === split.userId);
              return (
                <div key={split.userId} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>₨ {split.amount.toLocaleString()}</span>
                    {split.paid ? (
                      <Badge variant="default" className="text-xs">Paid</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Pending</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {mySplit && !mySplit.paid && !iPaid && (
            <Button 
              onClick={() => handleSettle(expense.id)} 
              className="w-full mt-3"
              size="sm"
            >
              Mark as Paid
            </Button>
          )}

          {expense.settled && (
            <Badge variant="default" className="w-full justify-center mt-3">
              <CheckCircle className="size-3 mr-1" />
              Settled
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Expenses</h1>
          <p className="text-gray-600">Track and split shared expenses</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expense-title">Title</Label>
                <Input
                  id="expense-title"
                  placeholder="e.g., Groceries, Electricity Bill"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Amount (₨)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Grocery">Grocery</SelectItem>
                    <SelectItem value="Utility">Utility</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Split With</Label>
                <div className="space-y-2 border rounded-lg p-3 max-h-40 overflow-y-auto">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`split-${user.id}`}
                        checked={selectedUsers.length === 0 || selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => {
                          if (selectedUsers.length === 0) {
                            // First selection - add all except this one if unchecking
                            if (!checked) {
                              setSelectedUsers(users.filter(u => u.id !== user.id).map(u => u.id));
                            }
                          } else {
                            if (checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                            }
                          }
                        }}
                      />
                      <Label htmlFor={`split-${user.id}`} className="text-sm flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {user.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {selectedUsers.length === 0 ? 'All members' : `${selectedUsers.length} member(s)`} selected
                </p>
              </div>
              <Button onClick={handleAddExpense} className="w-full">
                Add Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Your Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl ${myBalance > 0 ? 'text-green-600' : myBalance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              ₨ {Math.abs(myBalance).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {myBalance > 0 ? 'You are owed' : myBalance < 0 ? 'You owe' : 'All settled!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="size-4 text-red-600" />
              Total Owed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">
              ₨ {expenses.reduce((acc, exp) => {
                const mySplit = exp.splitDetails.find(s => s.userId === currentUser?.id);
                if (mySplit && !mySplit.paid && exp.paidBy !== currentUser?.id) {
                  return acc + mySplit.amount;
                }
                return acc;
              }, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">Amount you owe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="size-4 text-green-600" />
              Total Owed to You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">
              ₨ {expenses.reduce((acc, exp) => {
                if (exp.paidBy === currentUser?.id) {
                  return acc + exp.splitDetails
                    .filter(s => !s.paid && s.userId !== currentUser?.id)
                    .reduce((sum, s) => sum + s.amount, 0);
                }
                return acc;
              }, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">Amount owed to you</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Expenses</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="settled">Settled</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {expenses.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-gray-500">No expenses yet. Add one to get started!</p>
              </CardContent>
            </Card>
          ) : (
            expenses.map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {expenses.filter(e => !e.settled).length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-gray-500">No pending expenses!</p>
              </CardContent>
            </Card>
          ) : (
            expenses.filter(e => !e.settled).map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          )}
        </TabsContent>

        <TabsContent value="settled" className="space-y-4">
          {expenses.filter(e => e.settled).length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-gray-500">No settled expenses yet</p>
              </CardContent>
            </Card>
          ) : (
            expenses.filter(e => e.settled).map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          )}
        </TabsContent>

        <TabsContent value="balances">
          <Card>
            <CardHeader>
              <CardTitle>Member Balances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {balances.map(({ user, balance }) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                  <div className={`text-right ${balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    <p>₨ {Math.abs(balance).toLocaleString()}</p>
                    <p className="text-xs">
                      {balance > 0 ? 'Gets back' : balance < 0 ? 'Owes' : 'Settled'}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
