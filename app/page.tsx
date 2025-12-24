"use client";

import { useState } from 'react';
// import { AppProvider, useApp } from './context/AppContext';
// import { Login } from './components/Login';
// import { Dashboard } from './components/Dashboard';
// import { TodosPage } from './components/TodosPage';
// import { CleaningDuty } from './components/CleaningDuty';
// import { ExpensesPage } from './components/ExpensesPage';
// import { ShoppingList } from './components/ShoppingList';
// import { Profile } from './components/Profile';
// import { MorePage } from './components/MorePage';
// import { GroupManagement } from './components/GroupManagement';
// import { Button } from './components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
// import { Badge } from './components/ui/badge';
// import { Toaster } from './components/ui/sonner';
import { 
  Home,
  CheckSquare,
  Sparkles,
  DollarSign,
  ShoppingCart,
  User,
  MoreHorizontal,
  Menu,
  X,
  Users
} from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { CleaningDuty } from '@/components/CleaningDuty';
import { ShoppingList } from '@/components/ShoppingList';
import { GroupManagement } from '@/components/GroupManagement';
import { Profile } from '@/components/Profile';
import { MorePage } from '@/components/MorePage';

type Page = 'dashboard' | 'todos' | 'cleaning' | 'expenses' | 'shopping' | 'group' | 'profile' | 'more';

function AppContent() {
  const { isAuthenticated, currentUser, login } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  const navigationItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home, color: 'from-indigo-500 to-purple-500' },
    { id: 'todos' as Page, label: 'Tasks', icon: CheckSquare, color: 'from-blue-500 to-cyan-500' },
    { id: 'cleaning' as Page, label: 'Cleaning', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { id: 'expenses' as Page, label: 'Expenses', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { id: 'shopping' as Page, label: 'Shopping', icon: ShoppingCart, color: 'from-orange-500 to-amber-500' },
    { id: 'group' as Page, label: 'Group', icon: Users, color: 'from-cyan-500 to-blue-500' },
    { id: 'profile' as Page, label: 'Profile', icon: User, color: 'from-violet-500 to-purple-500' },
    { id: 'more' as Page, label: 'More', icon: MoreHorizontal, color: 'from-gray-500 to-slate-500' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'todos':
        return <TodosPage />;
      case 'cleaning':
        return <CleaningDuty
         />;
      case 'expenses':
        return <ExpensesPage />;
      case 'shopping':
        return <ShoppingList />;
      case 'group':
        return <GroupManagement />;
      case 'profile':
        return <Profile />;
      case 'more':
        return <MorePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <Home className="size-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold">RoomMate</h2>
              <p className="text-xs text-gray-600">{currentUser?.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 bg-white border-r min-h-screen sticky top-0 shadow-xl">
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Home className="size-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">RoomMate</h2>
                <p className="text-xs text-gray-600">Manager Pro</p>
              </div>
            </div>

            {/* User Info */}
            <div className="relative overflow-hidden mb-6 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg text-white">
              <div className="absolute top-0 right-0 -mt-2 -mr-2 size-20 bg-white/10 rounded-full blur-2xl" />
              <div className="relative flex items-center gap-3">
                <Avatar className="size-12 ring-2 ring-white/30">
                  <AvatarImage src={currentUser?.profilePicture} />
                  <AvatarFallback className="bg-white/20 text-white">
                    {currentUser?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{currentUser?.name}</p>
                  <Badge 
                    variant={currentUser?.presenceStatus === 'Present' ? 'default' : 'secondary'}
                    className="mt-1 text-xs bg-white/20 hover:bg-white/30 border-0"
                  >
                    {currentUser?.presenceStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="size-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white">
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
                    <Home className="size-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">Menu</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              {/* User Info Mobile */}
              <div className="relative overflow-hidden mb-6 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg text-white">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 size-24 bg-white/10 rounded-full blur-2xl" />
                <div className="relative flex items-center gap-3">
                  <Avatar className="size-14 ring-4 ring-white/30">
                    <AvatarImage src={currentUser?.profilePicture} />
                    <AvatarFallback className="bg-white/20 text-white text-lg">
                      {currentUser?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-white/80">{currentUser?.email}</p>
                    <Badge 
                      variant={currentUser?.presenceStatus === 'Present' ? 'default' : 'secondary'}
                      className="mt-2 bg-white/20 hover:bg-white/30 border-0"
                    >
                      {currentUser?.presenceStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2 flex-1 overflow-y-auto">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="size-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen pb-20 lg:pb-0">
          {renderPage()}
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-30 shadow-2xl">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all ${
                  isActive ? `bg-gradient-to-br ${item.color} text-white shadow-lg scale-105` : 'text-gray-600'
                }`}
              >
                <Icon className="size-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Toaster richColors position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}