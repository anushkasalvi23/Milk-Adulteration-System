import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSignIn, useSignUp, useAuth } from '@clerk/clerk-react';
import { ShieldCheck, ArrowRight, Eye, EyeOff, Droplet, Layers, Gauge, Beaker, Thermometer, Zap } from 'lucide-react';

const clerkError = (err) =>
  err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message || 'Something went wrong. Please try again.';

const READINGS = [
  [Droplet, 'Fat'], [Layers, 'SNF'], [Gauge, 'Density'], [Beaker, 'pH'], [Thermometer, 'Freezing point'], [Zap, 'Conductivity'],
];

function Brand() {
  return (
    <div className="flex items-center justify-center gap-2 text-slate-900 font-semibold text-xl">
      <ShieldCheck className="w-7 h-7" /> PureMilk
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-500">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  'w-full rounded-full border border-slate-400 bg-white px-5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 placeholder-slate-400';

function PasswordInput({ value, onChange, placeholder = '********', autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        required
        minLength={8}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${inputCls} pr-12`}
      />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-4 h-4"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" /><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" /><path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.600 10.8l7.9-6.1z" /><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.600-5.900c-2.100 1.400-4.9 2.3-8.300 2.300-6.300 0-11.600-4.1-13.500-9.8l-7.9 6.1C6.500 42.600 14.600 48 24 48z" /></svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M16.4 12.6c0-2.500 2-3.700 2.1-3.800-1.200-1.700-3-1.900-3.600-2-1.500-.2-3 .9-3.800.9s-2-.9-3.300-.9c-1.700 0-3.300 1-4.200 2.500-1.800 3.100-.5 7.700 1.300 10.200.9 1.200 1.900 2.600 3.200 2.500 1.300-.1 1.800-.8 3.300-.8s2 .8 3.300.8 2.200-1.200 3.100-2.400c1-1.400 1.400-2.800 1.400-2.900-.1 0-2.800-1.100-2.800-4.1zM13.900 5.100c.7-.9 1.200-2.100 1.100-3.300-1 0-2.3.7-3 1.600-.7.800-1.200 2-1.100 3.200 1.100.1 2.300-.6 3-1.500z" /></svg>
  );
}

function Hero() {
  return (
    <div className="relative hidden md:flex flex-col rounded-[22px] overflow-hidden bg-black text-white p-8 min-h-[520px]">
      <div className="absolute inset-0 opacity-90" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(37,99,255,0.95) 0 10px, rgba(0,0,0,0) 10px 26px)', maskImage: 'linear-gradient(to top, black 5%, transparent 70%)', WebkitMaskImage: 'linear-gradient(to top, black 5%, transparent 70%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-600/60 to-transparent" />
      <div className="relative">
        <h2 className="text-3xl font-medium leading-tight tracking-tight">Screen milk.<br />Catch adulteration.</h2>
        <p className="mt-4 text-sm text-slate-300 max-w-xs">Six field readings in, one clear decision out. Triage every sample in seconds and confirm flagged ones in the lab.</p>
      </div>
      <div className="relative mt-auto flex flex-wrap gap-2">
        {READINGS.map(([Icon, label]) => (
          <span key={label} className="flex items-center gap-1.5 text-xs bg-white/10 backdrop-blur border border-white/15 rounded-full px-3 py-1.5"><Icon className="w-3.5 h-3.5" />{label}</span>
        ))}
      </div>
    </div>
  );
}

function Social({ onGoogle, onApple, verb }) {
  const btn = 'w-full flex items-center justify-center gap-2 rounded-full bg-slate-100 hover:bg-slate-200 py-2.5 text-sm text-slate-800 transition-colors';
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-slate-300" />Or continue with<span className="h-px flex-1 bg-slate-300" /></div>
      <button type="button" onClick={onGoogle} className={btn}><GoogleIcon /> {verb} with Google</button>
      <button type="button" onClick={onApple} className={btn}><AppleIcon /> {verb} with Apple</button>
    </div>
  );
}

const submitCls = 'w-full flex items-center justify-center gap-2 rounded-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-medium py-2.5 text-sm transition-colors';
const Spinner = () => <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;

function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const [step, setStep] = useState('login'); // login | forgot | reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const run = async (fn) => {
    if (!isLoaded) return;
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(clerkError(err));
    } finally {
      setBusy(false);
    }
  };

  const finish = async (res) => {
    if (res.status === 'complete') {
      await setActive({ session: res.createdSessionId });
      navigate('/dashboard', { replace: true });
    } else {
      setError('Additional verification is required for this account, which this page does not support yet.');
    }
  };

  const login = (e) => {
    e.preventDefault();
    run(async () => finish(await signIn.create({ identifier: email, password })));
  };

  const sendReset = (e) => {
    e.preventDefault();
    run(async () => {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: email });
      setInfo(`We emailed a code to ${email}.`);
      setStep('reset');
    });
  };

  const doReset = (e) => {
    e.preventDefault();
    run(async () => finish(await signIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code, password })));
  };

  const oauth = (strategy) =>
    run(() => signIn.authenticateWithRedirect({ strategy, redirectUrl: '/sso-callback', redirectUrlComplete: '/dashboard' }));

  const title = step === 'login' ? 'Log in to your account' : step === 'forgot' ? 'Reset your password' : 'Choose a new password';
  const sub = step === 'login' ? 'Welcome back. Fill in your details to get back in.' : step === 'forgot' ? 'Enter your email and we will send you a code.' : 'Enter the emailed code and a new password.';

  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900 text-center mt-4">{title}</h1>
      <p className="text-sm text-slate-400 text-center mt-1.5 mb-7">{sub}</p>

      {step === 'login' && (
        <form onSubmit={login} className="space-y-4">
          <Field label="Email"><input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} /></Field>
          <Field label="Password"><PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></Field>
          <div className="flex justify-end text-xs"><button type="button" onClick={() => { setStep('forgot'); setError(null); }} className="text-blue-800 underline">Forgot password</button></div>
          <Err error={error} />
          <button type="submit" disabled={busy || !isLoaded} className={submitCls}>{busy ? <Spinner /> : <>Log In <ArrowRight className="w-4 h-4" /></>}</button>
        </form>
      )}

      {step === 'forgot' && (
        <form onSubmit={sendReset} className="space-y-4">
          <Field label="Email"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} /></Field>
          <Err error={error} />
          <button type="submit" disabled={busy || !isLoaded} className={submitCls}>{busy ? <Spinner /> : 'Send reset code'}</button>
          <button type="button" onClick={() => { setStep('login'); setError(null); }} className="w-full text-xs text-slate-500 hover:text-slate-800">Back to log in</button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={doReset} className="space-y-4">
          {info && <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{info}</p>}
          <Field label="Code"><input required inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" className={inputCls} /></Field>
          <Field label="New password"><PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></Field>
          <Err error={error} />
          <button type="submit" disabled={busy || !isLoaded} className={submitCls}>{busy ? <Spinner /> : 'Reset password'}</button>
        </form>
      )}

      {step === 'login' && <div className="mt-5"><Social verb="Sign in" onGoogle={() => oauth('oauth_google')} onApple={() => oauth('oauth_apple')} /></div>}
      <p className="text-xs text-slate-400 text-center mt-6">Don't have an account? <Link to="/sign-up" className="text-blue-800 font-semibold">Create One</Link></p>
    </>
  );
}

function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // form | verify
  const [first, setFirst] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const run = async (fn) => {
    if (!isLoaded) return;
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(clerkError(err));
    } finally {
      setBusy(false);
    }
  };

  const finish = async (res) => {
    if (res.status === 'complete') {
      await setActive({ session: res.createdSessionId });
      navigate('/dashboard', { replace: true });
    } else {
      setError('Sign up needs extra steps that are enabled in your Clerk settings (for example a phone number or username).');
    }
  };

  const create = (e) => {
    e.preventDefault();
    run(async () => {
      const res = await signUp.create({ emailAddress: email, password, firstName: first || undefined });
      if (res.status === 'complete') return finish(res);
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
    });
  };

  const verify = (e) => {
    e.preventDefault();
    run(async () => finish(await signUp.attemptEmailAddressVerification({ code })));
  };

  const oauth = (strategy) =>
    run(() => signUp.authenticateWithRedirect({ strategy, redirectUrl: '/sso-callback', redirectUrlComplete: '/dashboard' }));

  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900 text-center mt-4">{step === 'form' ? 'Create your account' : 'Verify your email'}</h1>
      <p className="text-sm text-slate-400 text-center mt-1.5 mb-7">{step === 'form' ? 'Start screening milk samples in minutes.' : `Enter the 6-digit code we sent to ${email}.`}</p>

      {step === 'form' ? (
        <form onSubmit={create} className="space-y-4">
          <Field label="Name (optional)"><input value={first} onChange={(e) => setFirst(e.target.value)} autoComplete="given-name" placeholder="Your name" className={inputCls} /></Field>
          <Field label="Email"><input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} /></Field>
          <Field label="Password"><PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters" /></Field>
          <div id="clerk-captcha" />
          <Err error={error} />
          <button type="submit" disabled={busy || !isLoaded} className={submitCls}>{busy ? <Spinner /> : <>Sign Up <ArrowRight className="w-4 h-4" /></>}</button>
          <Social verb="Sign up" onGoogle={() => oauth('oauth_google')} onApple={() => oauth('oauth_apple')} />
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <Field label="Verification code"><input required inputMode="numeric" autoFocus value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" className={inputCls} /></Field>
          <Err error={error} />
          <button type="submit" disabled={busy || !isLoaded} className={submitCls}>{busy ? <Spinner /> : 'Verify & continue'}</button>
          <button type="button" onClick={() => { setStep('form'); setError(null); }} className="w-full text-xs text-slate-500 hover:text-slate-800">Use a different email</button>
        </form>
      )}
      <p className="text-xs text-slate-400 text-center mt-6">Already have an account? <Link to="/login" className="text-blue-800 font-semibold">Log In</Link></p>
    </>
  );
}

function Err({ error }) {
  return error ? <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p> : null;
}

export default function AuthPage({ mode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (isLoaded && isSignedIn) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-600 to-neutral-500 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[28px] p-3 sm:p-4 grid md:grid-cols-2 gap-4 shadow-2xl">
        <Hero />
        <div className="px-3 sm:px-8 py-6 flex flex-col justify-center">
          <Link to="/"><Brand /></Link>
          {mode === 'sign-up' ? <SignUpForm /> : <SignInForm />}
        </div>
      </div>
    </div>
  );
}
