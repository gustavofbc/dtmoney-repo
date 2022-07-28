import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from './services/api';

interface Transaction {
    id: number,
    title: string,
    type: string,
    category: string,
    amount: number,
    createdAt: string
}

// interface TransactionInput{
//     title: string,
//     type: string,
//     category: string,
//     amount: number,
// }

// outra solução:

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

// outra solução:

// type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'category' | 'type'>

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (Transaction: TransactionInput) => void;
}

export const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

interface TransactionsProviderProps {
    children: ReactNode;
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api.get('transactions')
            .then(response => setTransactions(response.data.transactions))
    }, []);

    function createTransaction(transaction: TransactionInput) {
        api.post('/transactions', transaction)
    }

    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    );
}