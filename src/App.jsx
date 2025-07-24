import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    type: "הוצאה",
    category: "",
    amount: "",
    date: "",
    notes: ""
  });

  const addRecord = () => {
    if (!form.amount || !form.date) return;
    setRecords([...records, { ...form, amount: parseFloat(form.amount) }]);
    setForm({ type: "הוצאה", category: "", amount: "", date: "", notes: "" });
  };

  const totals = records.reduce(
    (acc, r) => {
      r.type === "הכנסה" ? (acc.income += r.amount) : (acc.expense += r.amount);
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const groupedByCategory = records.reduce((acc, r) => {
    if (!acc[r.category]) acc[r.category] = 0;
    acc[r.category] += r.amount * (r.type === "הוצאה" ? 1 : -1);
    return acc;
  }, {});

  const data = Object.entries(groupedByCategory).map(([key, value]) => ({ name: key, amount: value }));

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto", direction: "rtl", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>ניהול הוצאות הבית</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option>הוצאה</option>
          <option>הכנסה</option>
        </select>
        <input placeholder="קטגוריה" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input placeholder="סכום" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input placeholder="הערות" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ flex: 1 }} />
        <button onClick={addRecord}>הוספה</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>סה"כ הכנסות: ₪{totals.income.toFixed(2)}</div>
        <div>סה"כ הוצאות: ₪{totals.expense.toFixed(2)}</div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th>תאריך</th>
            <th>סוג</th>
            <th>קטגוריה</th>
            <th>סכום</th>
            <th>הערות</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>{r.type}</td>
              <td>{r.category}</td>
              <td>₪{r.amount.toFixed(2)}</td>
              <td>{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip formatter={(value) => `₪${value.toFixed(2)}`} />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}