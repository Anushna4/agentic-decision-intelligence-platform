import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import Button from '../../components/ui/Button';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const Login = () => {
  const { login } = usePlatform();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate short loading delay for realistic premium feel
    setTimeout(() => {
      if (!email.includes('@') || password.length < 4) {
        setError('Please enter a valid enterprise email and a 4+ character password.');
        setLoading(false);
        return;
      }

      login(email, password);
      setLoading(false);
      navigate('/role-selection');
    }, 800);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      login('s.jenkins@apexdecision.ai', 'demopassword');
      setLoading(false);
      navigate('/role-selection');
    }, 500);
  };

  return (
    <div className="min-h-screen w-screen flex bg-slate-50 text-slate-700">
      {/* Left Pane: Branding & Graphics (Hidden on Mobile) */}
      <div className="hidden lg:flex w-7/12 bg-slate-900 text-white relative overflow-hidden flex-col justify-between p-12">
        {/* Top Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <BrainCircuit className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Apex Decision Intelligence</h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Agentic Decision Platform</p>
          </div>
        </div>

        {/* Abstract Decision Art (Gradients + Nodes) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Gradients */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px]"></div>
          
          {/* Mock Node Networks */}
          <svg className="w-10/12 h-2/3 opacity-30 stroke-slate-700 stroke-2 fill-none" viewBox="0 0 800 600">
            <circle cx="200" cy="150" r="6" className="fill-blue-500 stroke-none" />
            <circle cx="600" cy="150" r="6" className="fill-blue-500 stroke-none" />
            <circle cx="400" cy="300" r="8" className="fill-indigo-500 stroke-none" />
            <circle cx="300" cy="450" r="6" className="fill-sky-500 stroke-none" />
            <circle cx="500" cy="450" r="6" className="fill-sky-500 stroke-none" />
            
            <path d="M200,150 L400,300" />
            <path d="M600,150 L400,300" />
            <path d="M400,300 L300,450" />
            <path d="M400,300 L500,450" />
            <path d="M300,450 L500,450" className="stroke-slate-800" strokeDasharray="5,5" />
            <path d="M200,150 L600,150" className="stroke-slate-800" strokeDasharray="5,5" />
          </svg>
        </div>

        {/* Brand Pitch/Description */}
        <div className="relative z-10 max-w-lg">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            Platform Version 2.4.0-Beta
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-4 tracking-tight leading-tight">
            Enterprise Decision Pipelines Executed by Autonomic Agents.
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Incorporate advanced multi-agent simulations, quantitative optimization algorithms, and rigorous compliance checks into your business strategy. Secure, auditable, and human-in-the-loop controlled.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 relative z-10 flex justify-between">
          <span>© 2026 Apex Decision Corp. All rights reserved.</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> ISO-27001 Certified</span>
        </div>
      </div>

      {/* Right Pane: Login Form Card */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Apex Decision</h1>
          </div>

          <Card className="border-slate-200/90 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-slate-900 font-extrabold">Welcome back</CardTitle>
              <CardDescription>Enter credentials to access the governance console</CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <div className="mb-4 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Enterprise Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. s.jenkins@apexdecision.ai"
                      className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Password
                    </label>
                    <span className="text-xs text-blue-600 hover:text-blue-700 cursor-not-allowed font-medium">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.75 mt-2 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Access Dashboard'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400 font-semibold uppercase tracking-wider">Demo Quickstart</span>
                </div>
              </div>

              {/* Quick Demo Login */}
              <Button
                onClick={handleQuickDemo}
                variant="secondary"
                className="w-full py-2.5 flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                disabled={loading}
              >
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>Sign In with Demo Credentials</span>
              </Button>
            </CardContent>
          </Card>

          {/* Helper instructions */}
          <p className="text-center text-xs text-slate-400 mt-6 max-w-sm mx-auto leading-relaxed">
            Apex Decision Platform uses federated SSO. If you require credentials, contact your enterprise System Administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
