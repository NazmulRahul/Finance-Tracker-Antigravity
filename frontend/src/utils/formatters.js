export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const getBalanceHistory = (transactions) => {
  // Sort transactions by date (ascending)
  const sorted = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  let currentBalance = 0;
  return sorted.map((t) => {
    if (t.type === 'income') {
      currentBalance += t.amount;
    } else {
      currentBalance -= t.amount;
    }
    return {
      date: new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      balance: currentBalance,
    };
  });
};

export const getCategoryData = (transactions) => {
  const data = [
    { name: 'Income', value: 0, color: '#4ade80' },
    { name: 'Expense', value: 0, color: '#f43f5e' },
  ];

  transactions.forEach((t) => {
    if (t.type === 'income') {
      data[0].value += t.amount;
    } else {
      data[1].value += t.amount;
    }
  });

  return data.filter(d => d.value > 0);
};
