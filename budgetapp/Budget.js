// Get elements
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const addTransactionButton = document.getElementById("add-transaction");
const transactionList = document.getElementById("transaction-list");
const balanceSpan = document.getElementById("balance");
const totalIncomeSpan = document.getElementById("total-income");
const totalExpensesSpan = document.getElementById("total-expenses");
const progressBar = document.getElementById("progress-bar");

// Update balance and transaction list
const updateSummary = () => {
    fetch("http://localhost:3000/getTransactions")
        .then(response => response.json())
        .then(transactions => {
            let totalIncome = 0;
            let totalExpenses = 0;

            // Clear transaction list
            transactionList.innerHTML = "";

            // Calculate total income and expenses
            transactions.forEach(transaction => {
                const listItem = document.createElement("li");
                listItem.textContent = `${transaction.description}: ${transaction.amount} (${transaction.type})`;
                transactionList.appendChild(listItem);

                if (transaction.type === "income") {
                    totalIncome += parseFloat(transaction.amount);
                } else {
                    totalExpenses += parseFloat(transaction.amount);
                }
            });

            // Update balance and expenses
            const balance = totalIncome - totalExpenses;
            balanceSpan.textContent = `$${balance}`;
            totalIncomeSpan.textContent = `$${totalIncome}`;
            totalExpensesSpan.textContent = `$${totalExpenses}`;

            // Update progress bar
            const percentage = totalIncome === 0 ? 0 : (totalExpenses / totalIncome) * 100;
            progressBar.style.width = `${percentage}%`;
        });
};

// Add transaction event handler
addTransactionButton.addEventListener("click", () => {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;
    const date = new Date().toISOString();

    if (!description || isNaN(amount)) {
        alert("Please enter valid transaction details.");
        return;
    }

    // Send the transaction data to the backend
    fetch("http://localhost:3000/getTransaction", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ description, amount, type, date })
    })
        .then(response => response.text())
        .then(() => {
            // Clear inputs and refresh summary
            descriptionInput.value = "";
            amountInput.value = "";
            updateSummary();
        });
});

// Initialize summary on page load
updateSummary();
