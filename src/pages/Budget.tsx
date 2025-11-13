import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Budget() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentBudget, setCurrentBudget] = useState<any>(null);
  const [formData, setFormData] = useState({
    amount: '',
    cycle: 'monthly',
  });

  useEffect(() => {
    if (user) {
      fetchCurrentBudget();
    }
  }, [user]);

  const fetchCurrentBudget = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .lte('start_date', new Date().toISOString().split('T')[0])
      .gte('end_date', new Date().toISOString().split('T')[0])
      .single();

    if (data) {
      // Calculate current spending
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', data.start_date)
        .lte('date', data.end_date);

      const spent = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
      const remaining = Number(data.amount) - spent;

      setCurrentBudget({ ...data, spent, remaining });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    if (formData.cycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setDate(endDate.getDate() + 7);
    }
    endDate.setDate(endDate.getDate() - 1);

    const budgetData = {
      user_id: user!.id,
      cycle: formData.cycle,
      amount,
      spent: 0,
      remaining: amount,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    };

    const { error } = await supabase.from('budgets').insert(budgetData);

    if (error) {
      toast({ variant: 'destructive', description: error.message });
      return;
    }

    toast({ title: 'Budget set successfully!' });
    setFormData({ amount: '', cycle: 'monthly' });
    fetchCurrentBudget();
  };

  const getProgressColor = () => {
    if (!currentBudget) return 'bg-primary';
    const percentage = (currentBudget.spent / Number(currentBudget.amount)) * 100;
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 80) return 'bg-warning';
    if (percentage >= 50) return 'bg-secondary';
    return 'bg-success';
  };

  const getWarningLevel = () => {
    if (!currentBudget) return null;
    const percentage = (currentBudget.spent / Number(currentBudget.amount)) * 100;
    if (percentage >= 100) {
      return { icon: XCircle, text: 'Budget exceeded!', variant: 'destructive' as const };
    }
    if (percentage >= 80) {
      return { icon: AlertCircle, text: '80% of budget used', variant: 'default' as const };
    }
    if (percentage >= 50) {
      return { icon: AlertCircle, text: '50% of budget used', variant: 'default' as const };
    }
    return { icon: CheckCircle2, text: 'Budget on track', variant: 'default' as const };
  };

  const warningLevel = getWarningLevel();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('budget')}</h1>

        {currentBudget ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('monthly')} {t('budget')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t('spent')}: ₹{currentBudget.spent.toFixed(2)}</span>
                    <span>{t('remaining')}: ₹{currentBudget.remaining.toFixed(2)}</span>
                  </div>
                  <Progress
                    value={(currentBudget.spent / Number(currentBudget.amount)) * 100}
                    className="h-4"
                  />
                  <div className="text-right text-sm font-medium">
                    {((currentBudget.spent / Number(currentBudget.amount)) * 100).toFixed(1)}% used
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">{t('budgetAmount')}</p>
                      <p className="text-2xl font-bold">₹{Number(currentBudget.amount).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-destructive/10">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">{t('spent')}</p>
                      <p className="text-2xl font-bold text-destructive">₹{currentBudget.spent.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-success/10">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">{t('remaining')}</p>
                      <p className="text-2xl font-bold text-success">₹{currentBudget.remaining.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </div>

                {warningLevel && (
                  <Alert variant={warningLevel.variant}>
                    <warningLevel.icon className="h-5 w-5" />
                    <AlertDescription className="text-base">{warningLevel.text}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('setBudget')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-base">{t('budgetAmount')}</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="h-12 text-base"
                    placeholder="Enter amount in ₹"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cycle" className="text-base">Cycle</Label>
                  <Select
                    value={formData.cycle}
                    onValueChange={(value) => setFormData({ ...formData, cycle: value })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">{t('monthly')}</SelectItem>
                      <SelectItem value="weekly">{t('weekly')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="h-12 w-full text-lg">
                  {t('setBudget')}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
