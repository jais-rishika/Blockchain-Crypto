export const miningController = ({ transactionMiner }) => ({
  mineTransactions(req, res) {
    transactionMiner.mineTransaction();
    return res.redirect('/api/block');
  }
});