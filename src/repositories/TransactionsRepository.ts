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
    const incomeTransactions = await this.find({ where: { type: 'income' } });
    let incomeTotal = 0;

    incomeTransactions.forEach(element => {
      incomeTotal += Number(element.value);
    });

    const outcomeTransactions = await this.find({ where: { type: 'outcome' } });

    let outcomeTotal = 0;
    outcomeTransactions.forEach(element => {
      outcomeTotal += Number(element.value);
    });

    const total = incomeTotal - outcomeTotal;

    const balance = {
      income: incomeTotal,
      outcome: outcomeTotal,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
