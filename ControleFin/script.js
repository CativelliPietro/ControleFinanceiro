const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

// const removeTransaction = ID => {
//     transactions = transactions.filter(transaction => 
//         transaction.id !== ID)
//     console.log(transactions)
//     updateLocalStore()
//     init()
// }
const removeTransaction = ID => {
    const transactionIndex = transactions.findIndex(transaction => transaction.id === ID);
    if (transactionIndex !== -1) {
        transactions.splice(transactionIndex, 1);
        updateLocalStore();
        init();
    }
}


const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement('li') // Pode usar para criar um novo elemento html

    li.classList.add(CSSClass)
    li.innerHTML = `
    ${transaction.name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
        x
    </button>
    `
    transactionsUl.append(li)

}

const updateBalanceValues = constValue = () => {
    const transactionAmounts = transactions
        .map(transaction => transaction.amount)
    const total = transactionAmounts
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)
    const income = transactionAmounts
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2)
    const expense = Math.abs(transactionAmounts
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
        .toFixed(2)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

// Control + k + f identa as linhas
const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}
init()

const updateLocalStore = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

form.addEventListener('submit', event => {
    event.preventDefault()

    const generateID = () => Math.round(Math.random() * 1000)

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()

    if (transactionName === '' || transactionAmount === '') {
        const showAlert = (message, alertType) => {
            const customAlert = document.getElementById('custom-alert');
            const customAlertMessage = document.getElementById('custom-alert-message');

            // Define a classe CSS para o tipo de alerta desejado
            customAlert.className = `custom-alert ${alertType}`;
            customAlertMessage.textContent = message;

            // Exibe o alerta
            customAlert.classList.add('show');

            // Adiciona um evento de clique no botão de fechar o alerta
            const closeBtn = document.getElementById('custom-alert-close-btn');
            closeBtn.addEventListener('click', () => {
                customAlert.classList.remove('show');
            });
        };
        // Exemplo de uso
        showAlert('Preencha todas as informações', 'success');
        return
    }
    
    const transaction = {
        id: generateID,
        name: transactionName,
        amount: Number.parseFloat(transactionAmount) // Transformando em número. Pode ser com o "Number(transactionAmount)"
    }

    transactions.push(transaction)
    init()
    updateLocalStore()
    // Limpar os inputs
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
})