export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roomNumber?: string;
  hostelName?: string;
  profilePicture?: string;
  presenceStatus: 'Present' | 'Out' | 'On-Leave' | 'Do-Not-Disturb';
  role?: 'Admin' | 'Member';
}

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  members: GroupMember[];
}

export interface GroupMember {
  userId: string;
  role: 'Admin' | 'Member';
  joinedAt: Date;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  assignedTo?: string[];
  groupId?: string;
  createdBy: string;
  reminders?: Date[];
}

export interface CleaningDuty {
  id: string;
  groupId: string;
  members: string[];
  frequency: 'Daily' | 'Weekly';
  currentTurn: string;
  lastCleanedDate?: Date;
  history: CleaningHistory[];
}

export interface CleaningHistory {
  date: Date;
  userId: string;
  status: 'Completed' | 'Skipped' | 'Late';
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Food' | 'Grocery' | 'Utility' | 'Transport' | 'Other';
  receipt?: string;
  splitType: 'Equal' | 'Custom' | 'Percentage';
  splitDetails: ExpenseSplit[];
  paidBy: string;
  groupId: string;
  date: Date;
  settled: boolean;
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
  paid: boolean;
  paidDate?: Date;
  proof?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  purchased: boolean;
  purchasedBy?: string;
  purchasedDate?: Date;
  groupId: string;
  addedBy: string;
  convertedToExpense?: boolean;
}

export interface OnTheWayRequest {
  id: string;
  userId: string;
  location?: string;
  fromLocation?: string;
  timestamp: Date;
  requests: ItemRequest[];
  active: boolean;
}

export interface ItemRequest {
  id: string;
  requestedBy: string;
  item: string;
  accepted: boolean;
  completed: boolean;
}

export interface LateArrival {
  userId: string;
  reason: 'Coming late' | 'Stuck in traffic' | 'Overtime at office' | 'Emergency';
  date: Date;
  estimatedTime?: string;
}

export interface LostAndFound {
  id: string;
  title: string;
  description: string;
  type: 'Lost' | 'Found';
  date: Date;
  postedBy: string;
  resolved: boolean;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  date: Date;
  priority: 'Normal' | 'Important' | 'Urgent';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface BillReminder {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  type: 'Gas' | 'Electricity' | 'Internet' | 'Rent' | 'Other';
  recurring: boolean;
  paid: boolean;
}
