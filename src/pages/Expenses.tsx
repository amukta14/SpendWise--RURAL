import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Expenses() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [formData, setFormData] = useState({
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    payment_mode: 'cash',
    notes: '',
    location: '',
  });

  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchCategories();
    }
  }, [user]);

  const fetchExpenses = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('expenses')
      .select('*, categories(*)')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    setExpenses(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const expenseData = {
      ...formData,
      user_id: user!.id,
      amount: parseFloat(formData.amount),
    };

    if (editingExpense) {
      const { error } = await supabase
        .from('expenses')
        .update(expenseData)
        .eq('id', editingExpense.id);

      if (error) {
        toast({ variant: 'destructive', description: error.message });
        return;
      }
      toast({ title: 'Expense updated!' });
    } else {
      const { error } = await supabase.from('expenses').insert(expenseData);

      if (error) {
        toast({ variant: 'destructive', description: error.message });
        return;
      }
      toast({ title: 'Expense added!' });
    }

    setIsOpen(false);
    setEditingExpense(null);
    resetForm();
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;

    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      toast({ variant: 'destructive', description: error.message });
      return;
    }

    toast({ title: 'Expense deleted!' });
    fetchExpenses();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      category_id: '',
      date: new Date().toISOString().split('T')[0],
      payment_mode: 'cash',
      notes: '',
      location: '',
    });
  };

  const openEditDialog = (expense: any) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      category_id: expense.category_id,
      date: expense.date,
      payment_mode: expense.payment_mode,
      notes: expense.notes || '',
      location: expense.location || '',
    });
    setIsOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('expenses')}</h1>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                {t('addExpense')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editingExpense ? t('edit') : t('addExpense')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-base">{t('amount')}</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-base">{t('category')}</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat[`name_${language}`]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base">{t('date')}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment" className="text-base">{t('paymentMode')}</Label>
                  <Select
                    value={formData.payment_mode}
                    onValueChange={(value) => setFormData({ ...formData, payment_mode: value })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">{t('cash')}</SelectItem>
                      <SelectItem value="upi">{t('upi')}</SelectItem>
                      <SelectItem value="credit">{t('credit')}</SelectItem>
                      <SelectItem value="other">{t('other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-base">{t('notes')}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="text-base"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 h-12 text-base">
                    {t('save')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setEditingExpense(null);
                      resetForm();
                    }}
                    className="flex-1 h-12 text-base"
                  >
                    {t('cancel')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {expenses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {t('noData')}
              </CardContent>
            </Card>
          ) : (
            expenses.map((expense) => (
              <Card key={expense.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold text-primary">
                          ₹{Number(expense.amount).toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-lg font-medium">
                          {expense.categories[`name_${language}`]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()} • {t(expense.payment_mode)}
                        </p>
                        {expense.notes && (
                          <p className="text-sm text-muted-foreground">{expense.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(expense)}
                      >
                        <Edit2 className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
