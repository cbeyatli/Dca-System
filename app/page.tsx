"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

const INTERVALS = [
  { key: "daily", label: "Daily", perYear: 365 },
  { key: "weekly", label: "Weekly", perYear: 52 },
  { key: "biweekly", label: "Bi-weekly", perYear: 26 },
  { key: "monthly", label: "Monthly", perYear: 12 },
] as const;

type IntervalKey = (typeof INTERVALS)[number]["key"];

type BtcPlan = {
  id: string;
  amountUsd: string;
  cycleCount: number;
  intervalLabel: string;
  startDate: string;
  notes: string;
  createdAt: string;
};

const SAVED_PLANS_KEY = "basedca_btc_plans";

export default function Home() {
  const [amountUsd, setAmountUsd] = useState("100");
  const [cycleCount, setCycleCount] = useState("12");
  const [intervalKey, setIntervalKey] = useState<IntervalKey>("weekly");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [referenceBtcPrice, setReferenceBtcPrice] = useState("85000");
  const [notes, setNotes] = useState("");
  const [savedPlans, setSavedPlans] = useState<BtcPlan[]>([]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(SAVED_PLANS_KEY);
    if (!raw) return;
    try {
      setSavedPlans(JSON.parse(raw) as BtcPlan[]);
    } catch {
      setSavedPlans([]);
    }
  }, []);

  const amountUsdNum = Number(amountUsd);
  const cycleCountNum = Number(cycleCount);
  const referenceBtcPriceNum = Number(referenceBtcPrice);
  const selectedInterval =
    INTERVALS.find((item) => item.key === intervalKey) ?? INTERVALS[1];

  const totalBudget = useMemo(() => {
    if (!Number.isFinite(amountUsdNum) || !Number.isFinite(cycleCountNum)) return 0;
    if (amountUsdNum <= 0 || cycleCountNum <= 0) return 0;
    return amountUsdNum * cycleCountNum;
  }, [amountUsdNum, cycleCountNum]);

  const estimatedBtc = useMemo(() => {
    if (!Number.isFinite(referenceBtcPriceNum) || referenceBtcPriceNum <= 0) return 0;
    return totalBudget / referenceBtcPriceNum;
  }, [referenceBtcPriceNum, totalBudget]);

  const estimatedDurationMonths = useMemo(() => {
    if (!Number.isFinite(cycleCountNum) || cycleCountNum <= 0) return 0;
    const years = cycleCountNum / selectedInterval.perYear;
    return years * 12;
  }, [cycleCountNum, selectedInterval.perYear]);

  function validate() {
    if (!Number.isFinite(amountUsdNum) || amountUsdNum <= 0) {
      return "Amount per buy must be greater than 0.";
    }
    if (!Number.isInteger(cycleCountNum) || cycleCountNum <= 0) {
      return "Cycles must be a positive whole number.";
    }
    if (!startDate) {
      return "Start date is required.";
    }
    if (!Number.isFinite(referenceBtcPriceNum) || referenceBtcPriceNum <= 0) {
      return "Reference BTC price must be greater than 0.";
    }
    return "";
  }

  function savePlan() {
    const error = validate();
    setFormError(error);
    if (error) return;

    const plan: BtcPlan = {
      id: `${Date.now()}`,
      amountUsd,
      cycleCount: cycleCountNum,
      intervalLabel: selectedInterval.label,
      startDate,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    const next = [plan, ...savedPlans].slice(0, 10);
    setSavedPlans(next);
    window.localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(next));
    setNotes("");
  }

  function clearPlans() {
    setSavedPlans([]);
    window.localStorage.removeItem(SAVED_PLANS_KEY);
  }

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <span className={styles.badge}>Bitcoin DCA Planner</span>
      </header>

      <main className={styles.content}>
        <h1 className={styles.title}>BaseDca</h1>
        <p className={styles.subtitle}>
          Create a Bitcoin DCA plan without connecting a wallet, and view your
          budget and estimated BTC accumulation.
        </p>

        <section className={styles.card}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="amount-usd">Amount per buy (USD)</label>
              <input
                id="amount-usd"
                type="number"
                min="1"
                step="1"
                value={amountUsd}
                onChange={(event) => setAmountUsd(event.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="cycles">Number of buys</label>
              <input
                id="cycles"
                type="number"
                min="1"
                step="1"
                value={cycleCount}
                onChange={(event) => setCycleCount(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="interval">Frequency</label>
              <select
                id="interval"
                value={intervalKey}
                onChange={(event) => setIntervalKey(event.target.value as IntervalKey)}
              >
                {INTERVALS.map((interval) => (
                  <option key={interval.key} value={interval.key}>
                    {interval.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="start-date">Start date</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="ref-price">Reference BTC price (USD)</label>
            <input
              id="ref-price"
              type="number"
              min="1"
              step="1"
              value={referenceBtcPrice}
              onChange={(event) => setReferenceBtcPrice(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="notes">Notes (optional)</label>
            <input
              id="notes"
              type="text"
              placeholder="Example: Long-term accumulation"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className={styles.summary}>
            <p>
              Asset: <strong>Bitcoin (BTC)</strong>
            </p>
            <p>
              Total planned budget: <strong>${totalBudget.toFixed(2)}</strong>
            </p>
            <p>
              Estimated BTC (by reference price):{" "}
              <strong>{estimatedBtc.toFixed(6)} BTC</strong>
            </p>
            <p>
              Estimated plan duration:{" "}
              <strong>{estimatedDurationMonths.toFixed(1)} months</strong>
            </p>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={savePlan}>
              Save Bitcoin Plan
            </button>
            <button type="button" onClick={clearPlans}>
              Clear All
            </button>
          </div>

          {formError ? <p className={styles.error}>{formError}</p> : null}
        </section>

        <section className={styles.savedPlans}>
          <h2>Saved Bitcoin Plans</h2>
          {savedPlans.length === 0 ? <p>No saved plans yet.</p> : null}
          {savedPlans.map((plan) => (
            <div className={styles.savedPlanCard} key={plan.id}>
              <p>
                ${plan.amountUsd} x {plan.cycleCount} ({plan.intervalLabel})
              </p>
              <p>Start: {plan.startDate}</p>
              <p>{plan.notes || "No notes"}</p>
              <p>Created: {new Date(plan.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
