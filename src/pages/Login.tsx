import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from '@/hooks/use-toast';
import SuccessAlert from "@/components/SuccessAlert";

const Login = () => {
  const { t } = useLanguage();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SuccessAlert open={showSuccess} message={t("loginButton") ? `${t("loginButton")} successful` : "Signed in successfully"} onClose={() => setShowSuccess(false)} />
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground text-center">{t("loginTitle")}</h1>

          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email || !password) return toast({ title: 'Missing credentials' });
              try {
                const api = await import('@/lib/api');
                const res = await api.apiFetch('/api/users/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (!res.ok) return toast({ title: data.error || 'Login failed' });

                // store token and user
                const token = data.token;
                // try to parse exp from JWT; fallback to 2 weeks
                const parseExpFromJWT = (tok) => {
                  try {
                    const parts = tok.split('.');
                    if (parts.length !== 3) return null;
                    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                    const json = decodeURIComponent(Array.prototype.map.call(atob(b64), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                    const payload = JSON.parse(json);
                    if (payload && payload.exp) return payload.exp * 1000;
                  } catch (e) {
                    // ignore
                  }
                  return null;
                };
                let expiry = parseExpFromJWT(token);
                if (!expiry) expiry = Date.now() + 14 * 24 * 60 * 60 * 1000;
                localStorage.setItem('token', token);
                localStorage.setItem('token_exp', String(expiry));
                localStorage.setItem('user', JSON.stringify(data.user));
                // show success alert, then navigate shortly after
                setShowSuccess(true);
                setTimeout(() => {
                  setShowSuccess(false);
                  navigate('/');
                }, 1200);
              } catch (err) {
                toast({ title: 'Network error' });
              }
            }}
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder={t("email")}
                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPw ? "text" : "password"}
                placeholder={t("password")}
                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {t("loginButton")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              {t("register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
