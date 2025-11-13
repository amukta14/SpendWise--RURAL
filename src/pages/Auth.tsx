import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: t('login') + ' Successful!' });
      } else {
        const { error } = await signUp(email, password, {
          name,
          phone_number: phone,
          village,
          monthly_income: parseFloat(monthlyIncome) || null,
          preferred_language: preferredLanguage,
        });
        if (error) throw error;
        setLanguage(preferredLanguage as any);
        toast({ title: t('signup') + ' Successful!' });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-10 w-10 text-primary" />
              <CardTitle className="text-3xl font-bold text-primary">SpendWise</CardTitle>
            </div>
            <LanguageSelector />
          </div>
          <CardDescription className="text-lg">
            {isLogin ? t('login') : t('signup')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">{t('name')}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">{t('phone')}</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="village" className="text-base">{t('village')}</Label>
                  <Input
                    id="village"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income" className="text-base">{t('monthlyIncome')}</Label>
                  <Input
                    id="income"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-base">Language</Label>
                  <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="te">తెలుగు</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <Button type="submit" className="h-12 w-full text-lg" disabled={loading}>
              {loading ? '...' : isLogin ? t('login') : t('signup')}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full text-base"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? `${t('signup')} →`
                : `← ${t('login')}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
