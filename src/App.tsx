/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { Layers } from "lucide-react";
import { Transaction, Bill, Account } from "./types";
import { format, parse, subMonths, subYears, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

// Components
import { BottomNav } from "./components/BottomNav";
import { Dashboard } from "./components/Dashboard";
import { TransactionsView } from "./components/TransactionsView";
import { Summary } from "./components/Summary";
import { TransactionForm } from "./components/TransactionForm";
import { BillsView } from "./components/BillsView";
import { CategoryDetailView } from "./components/CategoryDetailView";
import { SettingsView } from "./components/SettingsView";
import { BudgetView } from "./components/BudgetView";
import { CarryForwardModal } from "./components/CarryForwardModal";
import { CategoryPicker } from "./components/CategoryPicker";
import { AddCategoryModal } from "./components/AddCategoryModal";

// Constants & Utils
import { INITIAL_CATEGORIES, AVAILABLE_ICONS, ICON_MAP } from "./constants";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "summary" | "transactionForm" | "bills" | "settings" | "transactions" | "categoryDetail" | "budget">("dashboard");
  const [previousTab, setPreviousTab] = useState<string>("dashboard");
  const [monthlyBudget, setMonthlyBudget] = useState(35000);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [cashInHand, setCashInHand] = useState(4400); // Current month's cash
  const [showCarryForwardModal, setShowCarryForwardModal] = useState(false);
  const [pendingCarryForward, setPendingCarryForward] = useState(4500); // Mocked previous month balance
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("Layers");
  const [csvImportError, setCsvImportError] = useState<string | null>(null);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Persistence keys
  const STORAGE_KEYS = {
    transactions: 'moneytracker_transactions',
    bills: 'moneytracker_bills',
    categories: 'moneytracker_categories',
    monthlyBudget: 'moneytracker_monthlyBudget',
    cashInHand: 'moneytracker_cashInHand',
    accounts: 'moneytracker_accounts'
  };

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem(STORAGE_KEYS.transactions);
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

      const savedBills = localStorage.getItem(STORAGE_KEYS.bills);
      if (savedBills) setBills(JSON.parse(savedBills));

      const savedCategories = localStorage.getItem(STORAGE_KEYS.categories);
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        setCategories(parsed.map((cat: any) => ({ ...cat, icon: ICON_MAP[cat.iconName] || Layers })));
      }

      const savedMonthlyBudget = localStorage.getItem(STORAGE_KEYS.monthlyBudget);
      if (savedMonthlyBudget) setMonthlyBudget(Number(savedMonthlyBudget));

      const savedCashInHand = localStorage.getItem(STORAGE_KEYS.cashInHand);
      if (savedCashInHand) setCashInHand(Number(savedCashInHand));

      const savedAccounts = localStorage.getItem(STORAGE_KEYS.accounts);
      if (savedAccounts) {
        // If we want to persist accounts, but for now, accounts are hardcoded
        // setAccounts(JSON.parse(savedAccounts));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bills, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories.map(cat => ({ ...cat, icon: undefined }))));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.monthlyBudget, monthlyBudget.toString());
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cashInHand, cashInHand.toString());
  }, [cashInHand]);

  const [accounts] = useState<Account[]>([
    {
      id: "acc-1",
      name: "AU Small Finance A/C",
      number: "ASFB-x1377",
      amount: 462537,
      type: "bank",
      updatedAt: "2026-04-02T10:00:00Z"
    },
    {
      id: "acc-2",
      name: "SBI Group A/C",
      number: "SBIG-x3379",
      amount: 10205,
      type: "bank",
      updatedAt: "2026-04-05T10:00:00Z",
      isEstimated: true
    },
    {
      id: "acc-3",
      name: "SBI Group A/C",
      number: "SBIG-x8361",
      amount: 154734,
      type: "bank",
      updatedAt: "2026-04-05T10:00:00Z",
      isEstimated: true
    },
    {
      id: "acc-4",
      name: "SBI Group A/C",
      number: "SBIG-x3309",
      amount: 2139714,
      type: "bank",
      updatedAt: "2026-04-05T10:00:00Z"
    },
    {
      id: "cc-1",
      name: "Axis CC",
      number: "AXIS-x5334",
      amount: 0,
      type: "credit_card",
      updatedAt: "2026-04-05T10:00:00Z"
    },
    {
      id: "cc-2",
      name: "Axis CC",
      number: "UTIB-x0587",
      amount: 2275,
      type: "credit_card",
      updatedAt: "2026-04-05T10:00:00Z",
      isEstimated: true
    },
    {
      id: "cc-3",
      name: "Axis CC",
      number: "UTIB-x5334",
      amount: 4514,
      type: "credit_card",
      updatedAt: "2026-04-05T10:00:00Z",
      isEstimated: true
    },
    {
      id: "cc-4",
      name: "ICICI CC",
      number: "ICIC-x2006",
      amount: 43377,
      type: "credit_card",
      updatedAt: "2026-04-04T10:00:00Z"
    }
  ]);

  const [summaryType, setSummaryType] = useState<"monthly" | "yearly">("monthly");
  const [summaryDate, setSummaryDate] = useState(new Date());
  const [summaryView, setSummaryView] = useState<"overview" | "spendAreas">("overview");

  useEffect(() => {
    // Simulate checking for new month and carry forward
    const hasCheckedThisMonth = localStorage.getItem(`carry_forward_${format(new Date(), "yyyy-MM")}`);
    if (!hasCheckedThisMonth && pendingCarryForward > 0) {
      setShowCarryForwardModal(true);
    }
  }, [pendingCarryForward]);

  const handleCarryForward = (confirm: boolean) => {
    if (confirm) {
      setCashInHand(prev => prev + pendingCarryForward);
      // Add a virtual transaction for carry forward
      const carryForwardTx: Transaction = {
        id: `cf-${Date.now()}`,
        amount: pendingCarryForward,
        description: "Cash carried forward from last month",
        category: "Income",
        date: new Date().toISOString(),
        type: "income",
        paymentMethod: "cash",
        isSpend: false
      };
      setTransactions(prev => [carryForwardTx, ...prev]);
    } else {
      // Mark as misc spend
      const miscSpendTx: Transaction = {
        id: `ms-${Date.now()}`,
        amount: pendingCarryForward,
        description: "Unaccounted cash from last month",
        category: "Miscellaneous",
        date: subMonths(new Date(), 1).toISOString(),
        type: "expense",
        paymentMethod: "cash",
        isSpend: true
      };
      setTransactions(prev => [miscSpendTx, ...prev]);
    }
    localStorage.setItem(`carry_forward_${format(new Date(), "yyyy-MM")}`, "true");
    setShowCarryForwardModal(false);
  };

  const parseCsvText = (csvText: string) => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = "";
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i += 1) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          currentCell += '"';
          i += 1;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          currentCell += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          currentRow.push(currentCell);
          currentCell = "";
        } else if (char === '\r') {
          continue;
        } else if (char === '\n') {
          currentRow.push(currentCell);
          rows.push(currentRow);
          currentRow = [];
          currentCell = "";
        } else {
          currentCell += char;
        }
      }
    }

    if (currentCell !== "" || currentRow.length > 0) {
      currentRow.push(currentCell);
      rows.push(currentRow);
    }

    return rows;
  };

  const parseCsvDate = (dateString: string) => {
    const parsed = parse(dateString, "yyyy/MMM/dd HH:mm:ss", new Date());
    return isNaN(parsed.getTime()) ? new Date(dateString) : parsed;
  };

  const mapPaymentMethod = (paymentType: string): Transaction["paymentMethod"] => {
    const normalized = (paymentType || "").toLowerCase();
    if (normalized.includes("cash")) return "cash";
    if (normalized.includes("upi")) return "upi";
    return "bank";
  };

  const importTransactionsFromCsv = async (file: File) => {
    try {
      const text = await file.text();
      const rows = parseCsvText(text).filter(row => row.length > 1);
      const headers = rows[0].map(header => header.trim());
      const importedTransactions: Transaction[] = rows.slice(1).map((values, index) => {
        const row = Object.fromEntries(headers.map((header, i) => [header, (values[i] ?? "").trim()]));
        const credit = Number(row["Credit"] || 0);
        const debit = Number(row["Debit"] || 0);
        const amount = credit > 0 ? credit : debit > 0 ? debit : 0;
        const type = (credit > 0 ? "income" : "expense") as "income" | "expense";
        const rawDescription = row["Merchant/Receiver/Sender"] || row["Notes"] || row["Category"] || row["SubType"] || row["Txn Type"] || "";
        const description = rawDescription.toString().toLowerCase() === "null" ? "" : rawDescription.toString();
        const category = row["Category"] || row["Txn Type"] || (type === "income" ? "Income" : "Miscellaneous");
        const paymentMethod = mapPaymentMethod(row["Payment Type"] || row["Account Type"] || "");
        const date = parseCsvDate(row["Date"] || row["date"] || "");

        return {
          id: `csv-${index}-${date.getTime()}`,
          amount,
          description: description || category,
          category,
          date: date.toISOString(),
          type,
          paymentMethod,
          isSpend: type === "expense"
        };
      }).filter(tx => tx.amount > 0 && tx.description);

      setTransactions(importedTransactions);
      setBills([]);
      setImportedFileName(file.name);
      setCsvImportError(null);
      setActiveTab("dashboard");
    } catch (error) {
      console.error("CSV import failed:", error);
      setCsvImportError("Failed to import CSV. Make sure the file is valid.");
    }
  };

  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    importTransactionsFromCsv(file);
  };

  const openCsvImportDialog = () => {
    setCsvImportError(null);
    fileInputRef.current?.click();
  };

  const handleTransactionClick = (tx: Transaction) => {
    setPreviousTab(activeTab);
    setSelectedTransaction(tx);
    setEditingTransaction({ ...tx });
    setActiveTab("transactionForm");
  };

  const openAddTransaction = (categoryOrEvent?: any) => {
    setPreviousTab(activeTab);
    const category = typeof categoryOrEvent === 'string' ? categoryOrEvent : "Miscellaneous";
    const newTx: Transaction = {
      id: "",
      amount: 0,
      description: "",
      category: category,
      date: new Date().toISOString(),
      type: "expense",
      paymentMethod: "cash",
      isSpend: true
    };
    setSelectedTransaction(null);
    setEditingTransaction(newTx);
    setActiveTab("transactionForm");
  };

  const saveTransaction = () => {
    if (!editingTransaction) return;
    
    if (editingTransaction.id === "") {
      // Adding new - ensure isSpend is properly set
      const newTx = { 
        ...editingTransaction, 
        id: Date.now().toString(),
        isSpend: editingTransaction.type === "expense" ? true : false
      };
      setTransactions(prev => [newTx, ...prev]);
    } else {
      // Updating existing - ensure isSpend is properly set
      const updatedTx = {
        ...editingTransaction,
        isSpend: editingTransaction.type === "expense" ? true : false
      };
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? updatedTx : t));
    }
    
    setActiveTab(previousTab as any);
    setSelectedTransaction(null);
    setEditingTransaction(null);
  };

  const deleteTransaction = () => {
    if (!editingTransaction || editingTransaction.id === "") return;
    setTransactions(prev => prev.filter(t => t.id !== editingTransaction.id));
    setActiveTab(previousTab as any);
    setSelectedTransaction(null);
    setEditingTransaction(null);
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    const iconObj = AVAILABLE_ICONS.find(i => i.name === selectedIcon);
    const newCat = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      label: newCategoryName,
      icon: iconObj ? iconObj.icon : null,
      color: "#6366F1"
    };
    setCategories(prev => [...prev, newCat]);
    setNewCategoryName("");
    setShowAddCategoryModal(false);
  };

  // Derived Data for Summary
  const filteredTransactions = transactions.filter(t => {
    const date = parseISO(t.date);
    if (summaryType === "monthly") {
      return isWithinInterval(date, {
        start: startOfMonth(summaryDate),
        end: endOfMonth(summaryDate)
      });
    } else {
      return date.getFullYear() === summaryDate.getFullYear();
    }
  });

  const totalSummarySpend = filteredTransactions
    .filter(t => t.type === "expense" && t.isSpend !== false)
    .reduce((sum, t) => sum + t.amount, 0);

  const summarySpendAreas = Object.entries(
    filteredTransactions
      .filter(t => t.type === "expense" && t.isSpend !== false)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>)
  )
    .map(([category, amount]) => ({ 
      category, 
      amount: Number(amount),
      percentage: totalSummarySpend > 0 ? (Number(amount) / totalSummarySpend) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const trendData = summaryType === "monthly" 
    ? Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(summaryDate, 5 - i);
        const monthTransactions = transactions.filter(t => {
          const date = parseISO(t.date);
          return isWithinInterval(date, {
            start: startOfMonth(d),
            end: endOfMonth(d)
          });
        });
        const amount = monthTransactions
          .filter(t => t.type === "expense" && t.isSpend !== false)
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          name: format(d, "MMM ''yy"),
          amount,
          date: d
        };
      })
    : Array.from({ length: 5 }).map((_, i) => {
        const d = subYears(summaryDate, 4 - i);
        const yearTransactions = transactions.filter(t => {
          const date = parseISO(t.date);
          return date.getFullYear() === d.getFullYear();
        });
        const amount = yearTransactions
          .filter(t => t.type === "expense" && t.isSpend !== false)
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          name: format(d, "yyyy"),
          amount,
          date: d
        };
      });

  // Derived Data for Dashboard
  const currentMonthTransactions = transactions.filter(t => {
    const date = parseISO(t.date);
    return isWithinInterval(date, {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date())
    });
  });

  const totalMonthlySpend = currentMonthTransactions
    .filter(t => t.type === "expense" && t.isSpend !== false)
    .reduce((sum, t) => sum + t.amount, 0);

  const topSpendAreas = Object.entries(
    currentMonthTransactions
      .filter(t => t.type === "expense" && t.isSpend !== false)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>)
  )
    .map(([category, amount]) => ({ 
      category, 
      amount: Number(amount),
      percentage: totalMonthlySpend > 0 ? (Number(amount) / totalMonthlySpend) * 100 : 0,
      diff: Number(amount) * 0.1 // Mocking
    }))
    .sort((a, b) => b.amount - a.amount);

  // Derived Data for Category Detail
  const categoryTrendData = selectedCategory ? Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const monthStr = format(date, "yyyy-MM");
    const amount = transactions
      .filter(tx => tx.category === selectedCategory && tx.type === "expense" && tx.isSpend !== false && tx.date.startsWith(monthStr))
      .reduce((sum, tx) => sum + tx.amount, 0);
    return {
      name: format(date, "MMM 'yy").toUpperCase(),
      amount,
      date
    };
  }) : [];

  const categoryTransactions = selectedCategory ? transactions
    .filter(tx => tx.category === selectedCategory)
    .sort((a, b) => b.date.localeCompare(a.date)) : [];

  const selectedCategoryTotal = categoryTrendData.length > 0 ? categoryTrendData[categoryTrendData.length - 1].amount : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-32">
      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && (
          <Dashboard 
            totalMonthlySpend={totalMonthlySpend}
            topSpendAreas={topSpendAreas}
            transactions={transactions}
            accounts={accounts}
            cashInHand={cashInHand}
            showBalance={showBalance}
            setShowBalance={setShowBalance}
            setActiveTab={setActiveTab}
            setPreviousTab={setPreviousTab}
            setSelectedCategory={setSelectedCategory}
            setSummaryView={setSummaryView}
            handleTransactionClick={handleTransactionClick}
            openAddTransaction={openAddTransaction}
            monthlyBudget={monthlyBudget}
            categories={categories}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionsView 
            transactions={transactions}
            totalMonthlySpend={totalMonthlySpend}
            setActiveTab={setActiveTab}
            handleTransactionClick={handleTransactionClick}
            categories={categories}
          />
        )}

        {activeTab === "summary" && (
          <Summary 
            summaryType={summaryType}
            setSummaryType={setSummaryType}
            summaryDate={summaryDate}
            setSummaryDate={setSummaryDate}
            summaryView={summaryView}
            setSummaryView={setSummaryView}
            trendData={trendData}
            totalSummarySpend={totalSummarySpend}
            summarySpendAreas={summarySpendAreas}
            filteredTransactions={filteredTransactions}
            setActiveTab={setActiveTab}
            setPreviousTab={setPreviousTab}
            setSelectedCategory={setSelectedCategory}
            handleTransactionClick={handleTransactionClick}
            openAddTransaction={openAddTransaction}
            categories={categories}
          />
        )}

        {activeTab === "transactionForm" && editingTransaction && (
          <TransactionForm 
            editingTransaction={editingTransaction}
            setEditingTransaction={setEditingTransaction}
            setActiveTab={setActiveTab}
            previousTab={previousTab}
            setSelectedTransaction={setSelectedTransaction}
            deleteTransaction={deleteTransaction}
            saveTransaction={saveTransaction}
            setShowCategoryPicker={setShowCategoryPicker}
            categories={categories}
            showAllCategories={showAllCategories}
            setShowAllCategories={setShowAllCategories}
            setShowAddCategoryModal={setShowAddCategoryModal}
          />
        )}

        {activeTab === "bills" && (
          <BillsView bills={bills} />
        )}

        {activeTab === "categoryDetail" && selectedCategory && (
          <CategoryDetailView 
            selectedCategory={selectedCategory}
            categoryTrendData={categoryTrendData}
            selectedCategoryTotal={selectedCategoryTotal}
            categoryTransactions={categoryTransactions}
            setActiveTab={setActiveTab}
            previousTab={previousTab}
            setSelectedCategory={setSelectedCategory}
            handleTransactionClick={handleTransactionClick}
            openAddTransaction={openAddTransaction}
            categories={categories}
          />
        )}

        {activeTab === "settings" && (
          <SettingsView 
            onImportCsv={openCsvImportDialog}
            importedFileName={importedFileName}
          />
        )}

        {activeTab === "budget" && (
          <BudgetView 
            monthlyBudget={monthlyBudget}
            setMonthlyBudget={setMonthlyBudget}
            setActiveTab={setActiveTab}
            previousTab={previousTab}
          />
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleCsvFileChange}
      />

      {csvImportError && (
        <div className="mx-4 mb-4 rounded-3xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
          {csvImportError}
        </div>
      )}

      <BottomNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => openAddTransaction()}
      />

      <CarryForwardModal 
        showCarryForwardModal={showCarryForwardModal}
        pendingCarryForward={pendingCarryForward}
        handleCarryForward={handleCarryForward}
      />

      <CategoryPicker 
        showCategoryPicker={showCategoryPicker}
        setShowCategoryPicker={setShowCategoryPicker}
        categories={categories}
        editingTransaction={editingTransaction}
        setEditingTransaction={setEditingTransaction}
      />

      <AddCategoryModal 
        showAddCategoryModal={showAddCategoryModal}
        setShowAddCategoryModal={setShowAddCategoryModal}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        availableIcons={AVAILABLE_ICONS}
        selectedIcon={selectedIcon}
        setSelectedIcon={setSelectedIcon}
        handleAddCategory={handleAddCategory}
      />
    </div>
  );
}
