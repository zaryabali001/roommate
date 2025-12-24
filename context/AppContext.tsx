/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Group, Todo, Expense, ShoppingItem, CleaningDuty, LostAndFound, Notice, Document, BillReminder } from '../types';
import {
  mockCurrentUser,
  mockUsers,
  mockGroup,
  mockTodos,
  mockExpenses,
  mockShoppingItems,
  mockCleaningDuty,
  mockLostAndFound,
  mockNotices,
  mockDocuments,
  mockBillReminders } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  group: Group | null;
  todos: Todo[];
  expenses: Expense[];
  shoppingItems: ShoppingItem[];
  cleaningDuty: CleaningDuty | null;
  lostAndFound: LostAndFound[];
  notices: Notice[];
  documents: Document[];
  billReminders: BillReminder[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateUserPresence: (status: User['presenceStatus']) => void;
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  toggleTodo: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  settleExpense: (expenseId: string, userId: string) => void;
  addShoppingItem: (item: string) => void;
  toggleShoppingItem: (id: string) => void;
  markCleaningComplete: () => void;
  addLostAndFound: (item: Omit<LostAndFound, 'id'>) => void;
  addNotice: (notice: Omit<Notice, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(mockCurrentUser);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [group, setGroup] = useState<Group | null>(mockGroup);
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(mockShoppingItems);
  const [cleaningDuty, setCleaningDuty] = useState<CleaningDuty | null>(mockCleaningDuty);
  const [lostAndFound, setLostAndFound] = useState<LostAndFound[]>(mockLostAndFound);
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [billReminders, setBillReminders] = useState<BillReminder[]>(mockBillReminders);

  const login = (email: string, password: string) => {
    setIsAuthenticated(true);
    setCurrentUser(mockCurrentUser);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const updateUserPresence = (status: User['presenceStatus']) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, presenceStatus: status };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const addTodo = (todo: Omit<Todo, 'id'>) => {
    const newTodo: Todo = {
      ...todo,
      id: `todo-${Date.now()}`,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `expense-${Date.now()}`,
    };
    setExpenses([newExpense, ...expenses]);
  };

  const settleExpense = (expenseId: string, userId: string) => {
    setExpenses(expenses.map(expense => {
      if (expense.id === expenseId) {
        const updatedSplitDetails = expense.splitDetails.map((split: { userId: string; }) =>
          split.userId === userId
            ? { ...split, paid: true, paidDate: new Date() }
            : split
        );
        const allPaid = updatedSplitDetails.every((split: { paid: any; }) => split.paid);
        return { ...expense, splitDetails: updatedSplitDetails, settled: allPaid };
      }
      return expense;
    }));
  };

  const addShoppingItem = (item: string) => {
    const newItem: ShoppingItem = {
      id: `shop-${Date.now()}`,
      name: item,
      purchased: false,
      groupId: group?.id || '',
      addedBy: currentUser?.id || '',
    };
    setShoppingItems([...shoppingItems, newItem]);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingItems(shoppingItems.map(item =>
      item.id === id
        ? {
            ...item,
            purchased: !item.purchased,
            purchasedBy: !item.purchased ? currentUser?.id : undefined,
            purchasedDate: !item.purchased ? new Date() : undefined,
          }
        : item
    ));
  };

  const markCleaningComplete = () => {
    if (cleaningDuty && currentUser) {
      const currentIndex = cleaningDuty.members.indexOf(cleaningDuty.currentTurn);
      const nextIndex = (currentIndex + 1) % cleaningDuty.members.length;
      
      setCleaningDuty({
        ...cleaningDuty,
        currentTurn: cleaningDuty.members[nextIndex],
        lastCleanedDate: new Date(),
        history: [
          { date: new Date(), userId: currentUser.id, status: 'Completed' },
          ...cleaningDuty.history,
        ],
      });
    }
  };

  const addLostAndFound = (item: Omit<LostAndFound, 'id'>) => {
    const newItem: LostAndFound = {
      ...item,
      id: `lf-${Date.now()}`,
    };
    setLostAndFound([newItem, ...lostAndFound]);
  };

  const addNotice = (notice: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `notice-${Date.now()}`,
    };
    setNotices([newNotice, ...notices]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        group,
        todos,
        expenses,
        shoppingItems,
        cleaningDuty,
        lostAndFound,
        notices,
        documents,
        billReminders,
        isAuthenticated,
        login,
        logout,
        updateUserPresence,
        addTodo,
        toggleTodo,
        addExpense,
        settleExpense,
        addShoppingItem,
        toggleShoppingItem,
        markCleaningComplete,
        addLostAndFound,
        addNotice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
