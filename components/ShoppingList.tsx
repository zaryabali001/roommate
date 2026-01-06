/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Plus, 
  ShoppingCart, 
  Check,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

export function ShoppingList() {
  const { shoppingItems, users, currentUser, addShoppingItem, toggleShoppingItem } = useApp();
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const handleAddItem = () => {
    if (!itemName.trim()) return;
    
    addShoppingItem(itemName);
    toast.success('Item added to shopping list!');
    setItemName('');
    setOpen(false);
  };

  const handleToggle = (itemId: string) => {
    toggleShoppingItem(itemId);
  };

  const pendingItems = shoppingItems.filter(i => !i.purchased);
  const purchasedItems = shoppingItems.filter(i => i.purchased);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Shopping List</h1>
          <p className="text-gray-600">Shared shopping list for your group</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Shopping Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="e.g., Milk, Bread, Eggs"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem();
                    }
                  }}
                />
              </div>
              <Button onClick={handleAddItem} className="w-full">
                Add to List
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{pendingItems.length}</div>
            <p className="text-xs text-gray-600 mt-1">Items to buy</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Purchased</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{purchasedItems.length}</div>
            <p className="text-xs text-gray-600 mt-1">Items bought</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            Items to Buy ({pendingItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">All items purchased!</p>
          ) : (
            <div className="space-y-2">
              {pendingItems.map((item: { addedBy: any; id: React.Key | null | undefined; purchased: any; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => {
                const addedBy = users.find((u: { id: any; }) => u.id === item.addedBy);
                
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      checked={item.purchased}
                      onCheckedChange={() => typeof item.id === 'string' && handleToggle(item.id)}
                    />
                    <div className="flex-1">
                      <p>{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Added by {addedBy?.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchased Items */}
      {purchasedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="size-5" />
              Purchased Items ({purchasedItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {purchasedItems.map((item) => {
                const purchasedBy = users.find((u: { id: any; }) => u.id === item.purchasedBy);
                
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                  >
                    <Checkbox
                      checked={item.purchased}
                      onCheckedChange={() => typeof item.id === 'string' && handleToggle(item.id)}
                    />
                    <div className="flex-1">
                      <p className="line-through text-gray-600">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="size-5">
                          <AvatarImage src={purchasedBy?.profilePicture} />
                          <AvatarFallback className="text-xs">
                            {purchasedBy?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-gray-500">
                          Bought by {purchasedBy?.name}
                        </p>
                        {item.purchasedDate && (
                          <>
                            <span className="text-gray-300">•</span>
                            <p className="text-xs text-gray-500">
                              {new Date(item.purchasedDate).toLocaleDateString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge variant="default">
                      <Check className="size-3 mr-1" />
                      Done
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
