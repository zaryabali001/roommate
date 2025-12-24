import { User, Group, Todo, Expense, ShoppingItem, CleaningDuty, OnTheWayRequest, LostAndFound, Notice, Document, BillReminder } from '../types';

// Mock current user
export const mockCurrentUser: User = {
  id: 'user-1',
  name: 'Ali Ahmed',
  email: 'ali@example.com',
  phone: '+92 300 1234567',
  roomNumber: '101',
  hostelName: 'Hostel A',
  profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  presenceStatus: 'Present',
  role: 'Admin',
};

// Mock users
export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'user-2',
    name: 'Hamza Khan',
    email: 'hamza@example.com',
    phone: '+92 300 2345678',
    roomNumber: '101',
    hostelName: 'Hostel A',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    presenceStatus: 'Out',
    role: 'Member',
  },
  {
    id: 'user-3',
    name: 'Bilal Raza',
    email: 'bilal@example.com',
    phone: '+92 300 3456789',
    roomNumber: '101',
    hostelName: 'Hostel A',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    presenceStatus: 'Present',
    role: 'Member',
  },
  {
    id: 'user-4',
    name: 'Usman Shah',
    email: 'usman@example.com',
    phone: '+92 300 4567890',
    roomNumber: '101',
    hostelName: 'Hostel A',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    presenceStatus: 'On-Leave',
    role: 'Member',
  },
];

// Mock group
export const mockGroup: Group = {
  id: 'group-1',
  name: 'Room 101 - Hostel A',
  inviteCode: 'ROOM101',
  createdBy: 'user-1',
  members: [
    { userId: 'user-1', role: 'Admin', joinedAt: new Date('2024-01-01') },
    { userId: 'user-2', role: 'Member', joinedAt: new Date('2024-01-02') },
    { userId: 'user-3', role: 'Member', joinedAt: new Date('2024-01-03') },
    { userId: 'user-4', role: 'Member', joinedAt: new Date('2024-01-04') },
  ],
};

// Mock todos
export const mockTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs',
    dueDate: new Date('2024-12-22'),
    priority: 'High',
    completed: false,
    createdBy: 'user-1',
  },
  {
    id: 'todo-2',
    title: 'Pay electricity bill',
    dueDate: new Date('2024-12-25'),
    priority: 'High',
    completed: false,
    createdBy: 'user-1',
  },
  {
    id: 'todo-3',
    title: 'Clean kitchen',
    dueDate: new Date('2024-12-21'),
    priority: 'Medium',
    completed: true,
    assignedTo: ['user-2', 'user-3'],
    groupId: 'group-1',
    createdBy: 'user-1',
  },
  {
    id: 'todo-4',
    title: 'Fix bathroom tap',
    priority: 'Low',
    completed: false,
    groupId: 'group-1',
    createdBy: 'user-2',
  },
];

// Mock cleaning duty
export const mockCleaningDuty: CleaningDuty = {
  id: 'duty-1',
  groupId: 'group-1',
  members: ['user-1', 'user-2', 'user-3'],
  frequency: 'Daily',
  currentTurn: 'user-1',
  lastCleanedDate: new Date('2024-12-20'),
  history: [
    { date: new Date('2024-12-20'), userId: 'user-3', status: 'Completed' },
    { date: new Date('2024-12-19'), userId: 'user-2', status: 'Completed' },
    { date: new Date('2024-12-18'), userId: 'user-1', status: 'Completed' },
    { date: new Date('2024-12-17'), userId: 'user-3', status: 'Late' },
    { date: new Date('2024-12-16'), userId: 'user-2', status: 'Skipped' },
  ],
};

// Mock expenses
export const mockExpenses: Expense[] = [
  {
    id: 'expense-1',
    title: 'Monthly Groceries',
    amount: 5000,
    category: 'Grocery',
    splitType: 'Equal',
    splitDetails: [
      { userId: 'user-1', amount: 1250, paid: true, paidDate: new Date('2024-12-15') },
      { userId: 'user-2', amount: 1250, paid: false },
      { userId: 'user-3', amount: 1250, paid: true, paidDate: new Date('2024-12-16') },
      { userId: 'user-4', amount: 1250, paid: false },
    ],
    paidBy: 'user-1',
    groupId: 'group-1',
    date: new Date('2024-12-15'),
    settled: false,
  },
  {
    id: 'expense-2',
    title: 'Electricity Bill',
    amount: 3000,
    category: 'Utility',
    splitType: 'Equal',
    splitDetails: [
      { userId: 'user-1', amount: 750, paid: false },
      { userId: 'user-2', amount: 750, paid: false },
      { userId: 'user-3', amount: 750, paid: false },
      { userId: 'user-4', amount: 750, paid: false },
    ],
    paidBy: 'user-2',
    groupId: 'group-1',
    date: new Date('2024-12-10'),
    settled: false,
  },
  {
    id: 'expense-3',
    title: 'Pizza Night',
    amount: 2400,
    category: 'Food',
    splitType: 'Equal',
    splitDetails: [
      { userId: 'user-1', amount: 600, paid: true, paidDate: new Date('2024-12-18') },
      { userId: 'user-2', amount: 600, paid: true, paidDate: new Date('2024-12-18') },
      { userId: 'user-3', amount: 600, paid: true, paidDate: new Date('2024-12-18') },
      { userId: 'user-4', amount: 600, paid: true, paidDate: new Date('2024-12-18') },
    ],
    paidBy: 'user-3',
    groupId: 'group-1',
    date: new Date('2024-12-18'),
    settled: true,
  },
];

// Mock shopping list
export const mockShoppingItems: ShoppingItem[] = [
  {
    id: 'shop-1',
    name: 'Milk',
    purchased: false,
    groupId: 'group-1',
    addedBy: 'user-1',
  },
  {
    id: 'shop-2',
    name: 'Bread',
    purchased: true,
    purchasedBy: 'user-2',
    purchasedDate: new Date('2024-12-20'),
    groupId: 'group-1',
    addedBy: 'user-1',
  },
  {
    id: 'shop-3',
    name: 'Eggs (1 dozen)',
    purchased: false,
    groupId: 'group-1',
    addedBy: 'user-3',
  },
  {
    id: 'shop-4',
    name: 'Detergent',
    purchased: false,
    groupId: 'group-1',
    addedBy: 'user-2',
  },
];

// Mock lost and found
export const mockLostAndFound: LostAndFound[] = [
  {
    id: 'lf-1',
    title: 'Black Umbrella',
    description: 'Left in the common room',
    type: 'Found',
    date: new Date('2024-12-19'),
    postedBy: 'user-2',
    resolved: false,
  },
  {
    id: 'lf-2',
    title: 'Blue Water Bottle',
    description: 'Lost near the entrance',
    type: 'Lost',
    date: new Date('2024-12-18'),
    postedBy: 'user-3',
    resolved: false,
  },
];

// Mock notices
export const mockNotices: Notice[] = [
  {
    id: 'notice-1',
    title: 'Internet Maintenance',
    content: 'Internet will be down tomorrow from 2 PM to 4 PM for maintenance.',
    postedBy: 'user-1',
    date: new Date('2024-12-20'),
    priority: 'Important',
  },
  {
    id: 'notice-2',
    title: 'Rent Due',
    content: 'Monthly rent is due by 25th December. Please make payment on time.',
    postedBy: 'user-1',
    date: new Date('2024-12-15'),
    priority: 'Urgent',
  },
];

// Mock documents
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Rent Receipt - December',
    type: 'PDF',
    url: '#',
    uploadedBy: 'user-1',
    uploadedAt: new Date('2024-12-01'),
  },
  {
    id: 'doc-2',
    name: 'Hostel Card',
    type: 'JPG',
    url: '#',
    uploadedBy: 'user-1',
    uploadedAt: new Date('2024-01-15'),
  },
];

// Mock bill reminders
export const mockBillReminders: BillReminder[] = [
  {
    id: 'bill-1',
    title: 'Electricity Bill',
    amount: 3000,
    dueDate: new Date('2024-12-25'),
    type: 'Electricity',
    recurring: true,
    paid: false,
  },
  {
    id: 'bill-2',
    title: 'Internet Bill',
    amount: 2000,
    dueDate: new Date('2024-12-28'),
    type: 'Internet',
    recurring: true,
    paid: false,
  },
  {
    id: 'bill-3',
    title: 'Gas Bill',
    amount: 1500,
    dueDate: new Date('2024-12-22'),
    type: 'Gas',
    recurring: true,
    paid: true,
  },
];
