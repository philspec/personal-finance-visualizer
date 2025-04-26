// test/testTransactions.js
const BASE_URL = 'http://localhost:3000/api/transactions';

async function createTransaction() {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 10050505050.5,
      date: new Date().toISOString(),
      description: 'Test transaction'
    }),
  });

  const data = await response.json();
  console.log('CREATE:', data);
  return data._id;
}

async function getTransactions() {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  console.log('GET ALL:', data);
  return data;
}

async function updateTransaction(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 200.75,
      date: new Date().toISOString(),
      description: 'Updated transaction'
    }),
  });

  const data = await response.json();
  console.log('UPDATE:', data);
}

async function deleteTransaction(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  console.log('DELETE:', data);
}

(async () => {
  const id = await createTransaction();
  await getTransactions();
})();
