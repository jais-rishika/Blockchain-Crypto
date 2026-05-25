export const TransactRequestDto = (body) => ({
  amount: body?.amount,
  recipient: body?.recipient
});

export const TransactionPoolMapResponseDto = (transactionMap) => transactionMap;

export const TransactionResponseDto = (transaction) => transaction;