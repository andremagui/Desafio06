// import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
  title: string;

  type: 'income' | 'outcome';

  value: number;

  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: RequestDTO): Promise<Transaction> {
    const catRepo = getRepository(Category);
    const transRepo = getCustomRepository(TransactionsRepository);

    const { total } = await transRepo.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('No funds.');
    }

    let catFound = await catRepo.findOne({
      where: { title: category },
    });

    if (!catFound) {
      catFound = catRepo.create({ title: category });
    }
    await catRepo.save(catFound);

    const transaction = transRepo.create({
      title,
      type,
      value,
      category: catFound,
    });

    await transRepo.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
