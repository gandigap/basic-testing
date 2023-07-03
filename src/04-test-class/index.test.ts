import lodash from 'lodash';

import {
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

const initialBalance = 20;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(initialBalance);

    expect(bankAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdrawAmount = 21;
    const bankAccount = getBankAccount(initialBalance);

    expect(() => bankAccount.withdraw(withdrawAmount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const transferAmount = 21;
    const toAccount = getBankAccount(0);
    const bankAccount = getBankAccount(initialBalance);

    expect(() => bankAccount.transfer(transferAmount, toAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const amount = 21;
    const bankAccount = getBankAccount(initialBalance);

    expect(() => bankAccount.transfer(amount, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const deposit = 20;
    const bankAccount = getBankAccount(initialBalance);

    bankAccount.deposit(deposit);

    expect(bankAccount.getBalance()).toBe(initialBalance + deposit);
  });

  test('should withdraw money', () => {
    const withdraw = 19;
    const bankAccount = getBankAccount(initialBalance);

    bankAccount.withdraw(withdraw);

    expect(bankAccount.getBalance()).toBe(initialBalance - withdraw);
  });

  test('should transfer money', () => {
    const initialBalance = 21;
    const amount = 20;
    const bankAccount = getBankAccount(initialBalance);
    const transferBankAccount = getBankAccount(initialBalance);

    bankAccount.transfer(amount, transferBankAccount);

    expect(transferBankAccount.getBalance()).toBe(initialBalance + amount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(initialBalance)
      .mockReturnValueOnce(1);

    const bankAccount = getBankAccount(initialBalance);
    const fetchBalance = await bankAccount.fetchBalance();

    expect(typeof fetchBalance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = 0;
    const bankBalance = 50;
    const bankAccount = getBankAccount(initialBalance);

    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValueOnce(bankBalance);
    await bankAccount.synchronizeBalance();

    expect(bankAccount.getBalance()).toBe(bankBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initialBalance = 0;
    const bankAccount = getBankAccount(initialBalance);

    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
