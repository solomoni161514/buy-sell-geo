import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Navbar from "@/components/Navbar";

const Register = () => {
  const { t } = useLanguage();
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground text-center">{t("registerTitle")}</h1>

          <form className="mt-8 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("fullName")}
                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder={t("email")}
                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPw ? "text" : "password"}
                placeholder={t("password")}
                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPw ? "text" : "password"}
                placeholder={t("confirmPassword")}
                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {t("registerButton")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              {t("signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
