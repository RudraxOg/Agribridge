"use client";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import {useTranslations} from "next-intl";
import { ArrowRight, CircleAlert, CircleCheck, Leaf, Mail, ShoppingBasket, Truck } from "lucide-react";
import { signInAction, signUpAction, forgotPasswordAction, resetPasswordAction, resendVerificationAction } from "@/features/auth/actions";
import { initialAuthState } from "@/features/auth/action-state";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form-controls";
import { PasswordInput } from "./password-input";

function Result({ state }: { state: typeof initialAuthState }) { if (state.status === "idle") return null; const Icon=state.status==="success"?CircleCheck:CircleAlert; return <div role={state.status==="error"?"alert":"status"} className={`flex gap-3 rounded-xl border p-3 text-sm ${state.status==="success"?"border-green-200 bg-green-50 text-green-900":"border-red-200 bg-red-50 text-red-900"}`}><Icon className="mt-0.5 shrink-0" aria-hidden size={18}/><p>{state.message}</p></div>; }

export function SignInForm({ locale, next, demoMode }: { locale: string; next?: string; demoMode: boolean }) {
  const [state, action, pending] = useActionState(signInAction, initialAuthState);
  const t = useTranslations("auth");
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label={t("email")} hint={demoMode ? "Local demo username: test.username" : undefined}>
        <div className="relative">
          <Mail className="absolute top-3.5 left-3 text-[var(--text-muted)]" aria-hidden size={19} />
          <Input
            className="pl-10"
            name="email"
            type={demoMode ? "text" : "email"}
            autoComplete="username"
            placeholder={demoMode ? "Email address or test.username" : "Email address"}
            required
          />
        </div>
      </Field>
      <Field label={t("password")} hint={demoMode ? "Local demo password: test.password" : undefined}>
        <PasswordInput name="password" autoComplete="current-password" />
      </Field>
      <div className="-mt-2 text-right">
        <Link href={`/${locale}/forgot-password`} className="inline-flex min-h-11 items-center font-bold text-[var(--forest)]">Forgot password?</Link>
      </div>
      <Result state={state} />
      <Button disabled={pending}>{pending ? "Signing in…" : t("signIn")}<ArrowRight aria-hidden size={18} /></Button>
      <p className="text-center text-sm text-[var(--text-muted)]">New to AgriBridge? <Link className="font-bold text-[var(--forest)]" href={`/${locale}/sign-up`}>Create an account</Link></p>
      <Link href={`/${locale}/demo-role`} className="flex min-h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 font-bold text-[var(--forest)]">{t("demo")}</Link>
    </form>
  );
}

const accountTypes = [
  { value: "fpo", title: "FPO", detail: "Manage farmers, aggregate stock, publish verified lots and track settlements.", Icon: Leaf },
  { value: "buyer", title: "Bulk Buyer", detail: "Discover verified produce lots, compare quality, place bulk orders and track delivery.", Icon: ShoppingBasket },
  { value: "logistics", title: "Logistics Partner", detail: "Manage vehicles, drivers, dispatches and agricultural shipments.", Icon: Truck },
] as const;

export function SignUpForm({ locale }: { locale: string }) {
  const [state, action, pending] = useActionState(signUpAction, initialAuthState);
  const [accountType, setAccountType] = useState<(typeof accountTypes)[number]["value"]>("fpo");
  const [password, setPassword] = useState("");
  const passwordHint = useMemo(() => password.length === 0 ? "At least 10 characters." : password.length < 10 ? "Use at least 10 characters." : password.length < 14 ? "Good password length." : "Strong password length.", [password]);
  return <form action={action} className="grid gap-5">
    <input type="hidden" name="locale" value={locale}/><input type="hidden" name="accountType" value={accountType}/>
    <fieldset className="grid gap-3"><legend className="text-sm font-bold">Choose an account type</legend><p className="-mt-1 text-xs text-[var(--text-muted)]">This is onboarding intent only. Organization roles are set securely after verification.</p><div className="grid gap-3 sm:grid-cols-3">{accountTypes.map(({value,title,detail,Icon}) => <button key={value} type="button" onClick={() => setAccountType(value)} aria-pressed={accountType === value} className={`min-h-36 rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest)] ${accountType === value ? "border-[var(--forest)] bg-[var(--surface-muted)] ring-1 ring-[var(--forest)]" : "border-[var(--border)] bg-white hover:border-[var(--forest)]"}`}><Icon className="mb-3 text-[var(--forest)]" aria-hidden size={22}/><span className="block font-black">{title}</span><span className="mt-1 block text-xs leading-5 text-[var(--text-muted)]">{detail}</span></button>)}</div></fieldset>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Full name"><Input name="displayName" autoComplete="name" required/></Field><Field label="Organization name"><Input name="organizationName" autoComplete="organization" required/></Field></div><Field label="Work email"><Input name="email" type="email" autoComplete="email" required/></Field><div className="grid gap-5 sm:grid-cols-2"><Field label="Password" hint={passwordHint}><PasswordInput name="password" autoComplete="new-password" minLength={10} onChange={(event) => setPassword(event.target.value)}/></Field><Field label="Confirm password"><PasswordInput name="confirmation" autoComplete="new-password" minLength={10}/></Field></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Phone number (optional)"><Input name="phone" type="tel" autoComplete="tel"/></Field><Field label="Preferred language"><Select name="preferredLocale" defaultValue={locale}><option value="en">English</option><option value="hi">हिन्दी</option></Select></Field></div><label className="flex gap-3 text-sm"><input className="mt-1 size-5 shrink-0 accent-[var(--forest)]" type="checkbox" name="consent" required/><span>I agree to the prototype terms and consent notice. I will not enter real bank or payment credentials.</span></label><Result state={state}/><Button disabled={pending}>{pending?"Creating account…":"Create account"}<ArrowRight aria-hidden size={18}/></Button><p className="text-center text-sm">Already registered? <Link className="font-bold text-[var(--forest)]" href={`/${locale}/sign-in`}>Sign in</Link></p></form>;
}

export function ForgotPasswordForm({ locale }: { locale:string }) { const [state,action,pending]=useActionState(forgotPasswordAction,initialAuthState); return <form action={action} className="grid gap-5"><input type="hidden" name="locale" value={locale}/><Field label="Email address"><Input name="email" type="email" autoComplete="email" required/></Field><Result state={state}/><Button disabled={pending}>{pending?"Sending…":"Send reset instructions"}</Button><Link className="flex min-h-11 items-center justify-center font-bold text-[var(--forest)]" href={`/${locale}/sign-in`}>Back to sign in</Link></form>; }

export function ResetPasswordForm({ locale }: { locale:string }) { const [state,action,pending]=useActionState(resetPasswordAction,initialAuthState); return <form action={action} className="grid gap-5"><input type="hidden" name="locale" value={locale}/><Field label="New password"><PasswordInput name="password" autoComplete="new-password" minLength={10}/></Field><Field label="Confirm password"><PasswordInput name="confirmation" autoComplete="new-password" minLength={10}/></Field><Result state={state}/><Button disabled={pending}>{pending?"Updating…":"Update password"}</Button></form>; }

export function ResendVerificationForm({ locale, email }: { locale:string; email?:string }) { const [state,action,pending]=useActionState(resendVerificationAction,initialAuthState); return <form action={action} className="grid gap-4"><input type="hidden" name="locale" value={locale}/><Field label="Email address"><Input name="email" type="email" autoComplete="email" defaultValue={email} required/></Field><Result state={state}/><Button variant="secondary" disabled={pending}>{pending?"Sending…":"Resend verification email"}</Button></form>; }
