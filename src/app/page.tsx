"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Send, Plus, ArrowDownLeft, ArrowUpRight, CheckCircle2, History, CreditCard, Building2, SmartphoneNfc } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function CampusWallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [activeModal, setActiveModal] = useState<'none' | 'transfer' | 'topup'>('none');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/transaction');
      const data = await res.json();
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeModal,
          amount: parseFloat(amount),
          recipient: activeModal === 'transfer' ? recipient : 'Self'
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setBalance(data.newBalance);
        setTransactions([data.transaction, ...transactions]);
        setActiveModal('none');
        setAmount('');
        setRecipient('');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#fafafa] flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"/></div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">CampusPay</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="hidden sm:flex items-center gap-4 text-slate-500">
              <span className="hover:text-slate-900 cursor-pointer">Dashboard</span>
              <span className="hover:text-slate-900 cursor-pointer">Cards</span>
              <span className="hover:text-slate-900 cursor-pointer">Settings</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold ml-4">
              ZE
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Cards & Actions */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Main Balance Card */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/10">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Building2 className="w-48 h-48 -mt-12 -mr-12" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-400 font-medium mb-1">Total Available Balance</p>
              <h1 className="text-5xl font-bold tracking-tight mb-8">₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</h1>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveModal('transfer')}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" /> Send Money
                </button>
                <button 
                  onClick={() => setActiveModal('topup')}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors backdrop-blur-md"
                >
                  <Plus className="w-4 h-4" /> Top Up
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition-all text-slate-700 hover:text-indigo-600">
              <div className="p-3 bg-slate-50 rounded-full"><SmartphoneNfc className="w-6 h-6" /></div>
              <span className="text-sm font-medium">NFC Pay</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition-all text-slate-700 hover:text-indigo-600">
              <div className="p-3 bg-slate-50 rounded-full"><CreditCard className="w-6 h-6" /></div>
              <span className="text-sm font-medium">Link Card</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition-all text-slate-700 hover:text-indigo-600">
              <div className="p-3 bg-slate-50 rounded-full"><History className="w-6 h-6" /></div>
              <span className="text-sm font-medium">Statements</span>
            </div>
          </div>
        </div>

        {/* Right Column: Transactions */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 h-full shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              Recent Transactions
            </h2>
            
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No transactions yet.</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        tx.type === 'topup' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                      )}>
                        {tx.type === 'topup' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{tx.recipient}</p>
                        <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-bold",
                        tx.type === 'topup' ? "text-emerald-600" : "text-slate-900"
                      )}>
                        {tx.type === 'topup' ? '+' : ''}{tx.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </p>
                      <p className="text-xs text-slate-400 capitalize">{tx.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeModal !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">
                {activeModal === 'transfer' ? 'Send Money' : 'Top Up Balance'}
              </h2>
              
              <form onSubmit={handleTransaction} className="space-y-4">
                {activeModal === 'transfer' && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Recipient (Student ID or Name)</label>
                    <input 
                      type="text" 
                      required
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="e.g. 2584985 or Cafeteria"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Amount (₺)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setActiveModal('none')}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors flex justify-center items-center"
                  >
                    {isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Confirm'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
