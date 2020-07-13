import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const reducer = (
      accumulator: Balance,
      transaction: Transaction,
    ): Balance => {
      if (transaction.type === 'income') {
        accumulator.income += Number(transaction.value);
      } else {
        accumulator.outcome += Number(transaction.value);
      }

      return accumulator;
    };

    const { income, outcome } = transactions.reduce(reducer, {
      income: 0,
      outcome: 0,
      total: 0,
    });

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
