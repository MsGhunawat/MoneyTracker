/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { View, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AnimatePresence, View as MotiView } from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction, Bill, Account, Currency, SUPPORTED_CURRENCIES } from "./types";
import { format, subMonths, subYears, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import tw from "twrnc";
import { requestSMSPermissions, syncRecentSMS, SyncRange } from "./services/smsService";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthWrapper } from "./components/auth/AuthWrapper";

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
import { 
  MOCK_TRANSACTIONS, 
  MOCK_BILLS, 
  INITIAL_CATEGORIES, 
  AVAILABLE_ICONS 
} from "./constants";

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
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
  const [cashInHand, setCashInHand] = useState(4400); // Current month's cash
  const [showCarryForwardModal, setShowCarryForwardModal] = useState(false);
  const [pendingCarryForward, setPendingCarryForward] = useState(4500); // Mocked previous month balance
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("Layers");
  const [isSyncingSMS, setIsSyncingSMS] = useState(false);

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
  const [summaryWindowDate, setSummaryWindowDate] = useState(new Date());
  const [summaryView, setSummaryView] = useState<"overview" | "spendAreas">("overview");
  const [currency, setCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]);

  useEffect(() => {
    const loadCurrency = async () => {
      const saved = await AsyncStorage.getItem('user_currency');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const found = SUPPORTED_CURRENCIES.find(c => c.code === parsed.code);
          if (found) setCurrency(found);
        } catch (e) {
          console.error("Error loading currency", e);
        }
      }
    };
    loadCurrency();
  }, []);

  const handleCurrencyChange = async (newCurrency: Currency) => {
    setCurrency(newCurrency);
    await AsyncStorage.setItem('user_currency', JSON.stringify(newCurrency));
  };

  useEffect(() => {
    // Keep window in sync when selecting a date outside current window context if needed
    // But for now, we want stability, so clicking a bar doesn't change summaryWindowDate
  }, [summaryDate]);

  useEffect(() => {
    const checkCarryForward = async () => {
      const monthKey = `carry_forward_${format(new Date(), "yyyy-MM")}`;
      const hasCheckedThisMonth = await AsyncStorage.getItem(monthKey);
      if (!hasCheckedThisMonth && pendingCarryForward > 0) {
        setShowCarryForwardModal(true);
      }
    };
    checkCarryForward();
  }, [pendingCarryForward]);

  const handleSMSSync = async (range: SyncRange) => {
    setIsSyncingSMS(true);
    try {
      const hasPermission = await requestSMSPermissions();
      if (hasPermission) {
        const extracted = await syncRecentSMS(range);
        if (extracted.length > 0) {
          const newTxs = extracted.map(ext => ({
            ...ext,
            id: `sms-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            paymentMethod: ext.paymentMethod || "upi",
            isSpend: ext.isSpend ?? true,
          } as Transaction));
          
          setTransactions(prev => {
            // Filter out exact duplicates by description and amount on the same day
            const uniqueNew = newTxs.filter(nt => 
              !prev.some(pt => 
                pt.description === nt.description && 
                pt.amount === nt.amount && 
                pt.date.split('T')[0] === nt.date.split('T')[0]
              )
            );
            return [...uniqueNew, ...prev];
          });
          
          alert(`Synced ${newTxs.length} transactions from your SMS messages!`);
        }
      }
    } catch (error) {
      console.error("SMS Sync Error:", error);
    } finally {
      setIsSyncingSMS(false);
    }
  };

  const handleCarryForward = async (confirm: boolean) => {
    if (confirm) {
      setCashInHand(prev => prev + pendingCarryForward);
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
    const monthKey = `carry_forward_${format(new Date(), "yyyy-MM")}`;
    await AsyncStorage.setItem(monthKey, "true");
    setShowCarryForwardModal(false);
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
      const newTx = { ...editingTransaction, id: Date.now().toString() };
      setTransactions(prev => [newTx, ...prev]);
    } else {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? editingTransaction : t));
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

  const currentDate = new Date();

  const trendData = summaryType === "monthly" 
    ? Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(summaryWindowDate, 5 - i);
        // Only show if not in future relative to currentDate
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
          name: format(d, "MMM"),
          amount: d > currentDate ? 0 : amount, // Zero out future amounts
          date: d,
          isFuture: d > currentDate
        };
      })
    : Array.from({ length: 6 }).map((_, i) => {
        const d = subYears(summaryWindowDate, 5 - i);
        const yearTransactions = transactions.filter(t => {
          const date = parseISO(t.date);
          return date.getFullYear() === d.getFullYear();
        });
        const amount = yearTransactions
          .filter(t => t.type === "expense" && t.isSpend !== false)
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          name: format(d, "yyyy"),
          amount: d.getFullYear() > currentDate.getFullYear() ? 0 : amount,
          date: d,
          isFuture: d.getFullYear() > currentDate.getFullYear()
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
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <AuthWrapper>
          <View style={tw`flex-1 bg-slate-50`}>
            <SafeAreaView style={tw`flex-1`}>
              <AnimatePresence exitBeforeEnter>
                {activeTab === "dashboard" && (
                  <MotiView
                    key="dashboard"
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={tw`flex-1`}
                  >
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
                      handleSMSSync={handleSMSSync}
                      isSyncingSMS={isSyncingSMS}
                      monthlyBudget={monthlyBudget}
                      categories={categories}
                      currency={currency}
                    />
                  </MotiView>
                )}

                {activeTab === "transactions" && (
                  <MotiView
                    key="transactions"
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={tw`flex-1`}
                  >
                    <TransactionsView 
                      transactions={transactions}
                      totalMonthlySpend={totalMonthlySpend}
                      setActiveTab={setActiveTab}
                      handleTransactionClick={handleTransactionClick}
                      categories={categories}
                      currency={currency}
                    />
                  </MotiView>
                )}

                {activeTab === "summary" && (
                  <MotiView
                    key="summary"
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={tw`flex-1`}
                  >
                    <Summary 
                      summaryType={summaryType}
                      setSummaryType={setSummaryType}
                      summaryDate={summaryDate}
                      setSummaryDate={setSummaryDate}
                      summaryWindowDate={summaryWindowDate}
                      setSummaryWindowDate={setSummaryWindowDate}
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
                      currency={currency}
                    />
                  </MotiView>
                )}

                {activeTab === "transactionForm" && editingTransaction && (
                  <MotiView
                    key="transactionForm"
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={tw`flex-1`}
                  >
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
                  </MotiView>
                )}

                {activeTab === "bills" && (
                  <MotiView
                    key="bills"
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={tw`flex-1`}
                  >
                    <BillsView 
                      bills={bills} 
                      currency={currency}
                    />
                  </MotiView>
                )}

                {activeTab === "categoryDetail" && selectedCategory && (
                  <MotiView
                    key="categoryDetail"
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={tw`flex-1`}
                  >
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
                  </MotiView>
                )}

                {activeTab === "settings" && (
                  <MotiView
                    key="settings"
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={tw`flex-1`}
                  >
                    <SettingsView 
                      currency={currency}
                      setCurrency={handleCurrencyChange}
                    />
                  </MotiView>
                )}

                {activeTab === "budget" && (
                  <MotiView
                    key="budget"
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={tw`flex-1`}
                  >
                    <BudgetView 
                      monthlyBudget={monthlyBudget}
                      setMonthlyBudget={setMonthlyBudget}
                      setActiveTab={setActiveTab}
                      previousTab={previousTab}
                      currency={currency}
                    />
                  </MotiView>
                )}
              </AnimatePresence>
            </SafeAreaView>

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
          </View>
        </AuthWrapper>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
