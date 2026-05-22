import { useState } from "react";

export interface TxRecord {
  id: string;
  type: string;
  amount: string;
  amountNum: number;
  date: string;
  status: "Completed" | "Pending";
}

const DEFAULT_BALANCE = 19850;

const DEFAULT_TRANSACTIONS: TxRecord[] = [
  { id: "TX-9021", type: "Yield Distribution",        amount: "+$450.00",     amountNum:  450,    date: "Today, 09:41 AM",       status: "Completed" },
  { id: "TX-8914", type: "Package Upgrade (Growth)",  amount: "-$2,000.00",   amountNum: -2000,   date: "Yesterday, 14:22 PM",   status: "Completed" },
  { id: "TX-8802", type: "Initial Deposit",           amount: "+$12,500.00",  amountNum:  12500,  date: "Jan 12, 10:00 AM",      status: "Completed" },
  { id: "TX-8701", type: "Yield Distribution",        amount: "+$380.00",     amountNum:  380,    date: "Jan 8, 09:00 AM",       status: "Completed" },
  { id: "TX-8654", type: "Yield Distribution",        amount: "+$320.00",     amountNum:  320,    date: "Dec 28, 09:05 AM",      status: "Completed" },
  { id: "TX-8512", type: "Starter Package",           amount: "-$500.00",     amountNum: -500,    date: "Dec 15, 11:30 AM",      status: "Completed" },
];

function loadBalance(): number {
  const s = localStorage.getItem("trustchain_balance");
  return s ? parseFloat(s) : DEFAULT_BALANCE;
}

function loadTransactions(): TxRecord[] {
  const s = localStorage.getItem("trustchain_transactions");
  if (s) { try { return JSON.parse(s); } catch { return DEFAULT_TRANSACTIONS; } }
  return DEFAULT_TRANSACTIONS;
}

function makeTxId() {
  return "TX-" + Math.floor(Math.random() * 9000 + 1000);
}

function nowTime() {
  return `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export function useBalance() {
  const [balance, setBalance] = useState<number>(loadBalance);
  const [transactions, setTransactions] = useState<TxRecord[]>(loadTransactions);

  function persist(newBal: number, newTxs: TxRecord[]) {
    localStorage.setItem("trustchain_balance", newBal.toString());
    localStorage.setItem("trustchain_transactions", JSON.stringify(newTxs));
    setBalance(newBal);
    setTransactions(newTxs);
  }

  function deposit(amount: number) {
    const tx: TxRecord = {
      id: makeTxId(),
      type: "USDT Deposit (TRC20)",
      amount: `+$${amount.toFixed(2)}`,
      amountNum: amount,
      date: nowTime(),
      status: "Pending",
    };
    const newTxs = [tx, ...transactions];
    persist(balance + amount, newTxs);
    return tx.id;
  }

  function withdraw(amount: number, address: string) {
    const short = address.length > 12 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
    const tx: TxRecord = {
      id: makeTxId(),
      type: `Withdrawal → ${short}`,
      amount: `-$${amount.toFixed(2)}`,
      amountNum: -amount,
      date: nowTime(),
      status: "Pending",
    };
    const newTxs = [tx, ...transactions];
    persist(balance - amount, newTxs);
    return tx.id;
  }

  return { balance, transactions, deposit, withdraw };
}
