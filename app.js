// Reference the Firestore collection where your transactions will be stored
const transactionsCollection = db.collection('transactions');

// Reference the HTML elements
const balanceDisplay = document.getElementById('bank-balance');
const transactionsTableBody = document.getElementById('transactions-body');

// Function to fetch and display the data
const fetchData = () => {
    // Listen for real-time changes in the 'transactions' collection, ordered by date
    transactionsCollection.orderBy('date', 'asc').onSnapshot(snapshot => {
        let transactions = [];
        snapshot.forEach(doc => {
            transactions.push({ id: doc.id, ...doc.data() });
        });

        // Update the HTML with the new data
        updateHTML(transactions);
    });
};

// Function to update the HTML content
const updateHTML = (transactions) => {
    transactionsTableBody.innerHTML = ''; // Clear the existing table data

    let currentBalance = 0;
    
    // Loop through each transaction
    transactions.forEach(transaction => {
        const isDeposit = transaction.amount.startsWith('+');
        const spentValue = isDeposit ? 0 : parseFloat(transaction.amount);
        const depositValue = isDeposit ? parseFloat(transaction.amount) : 0;

        currentBalance += depositValue - spentValue;
        
        // Create a new row for the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.object}</td>
            <td>$${spentValue.toFixed(2)}</td>
            <td>${transaction.date}</td>
            <td>$${currentBalance.toFixed(2)}</td>
        `;
        transactionsTableBody.appendChild(row);
    });

    // Display the final bank balance
    balanceDisplay.textContent = `$${currentBalance.toFixed(2)}`;
};

// Initial data fetch
fetchData();

// Note: To add new data, you would use a function like this:
/*
const addTransaction = (object, amount, date) => {
    transactionsCollection.add({
        object: object,
        amount: amount,
        date: date
    }).then(() => {
        console.log("Transaction added successfully!");
    }).catch(error => {
        console.error("Error adding document: ", error);
    });
};
*/
