const Web3 = require('web3');
const Token = artifacts.require('Token');

const getProvider = Contract => {
  const adapter = Contract.interfaceAdapter;

  return adapter.web3.currentProvider
}

const topUpMetamask = async (account, etherAmount, meta) => {
  const web3 = new Web3(meta.provider);
  const value = web3.utils.toWei(etherAmount, 'ether');
  await web3.eth.sendTransaction({
    from: meta.accounts[0],
    to: account,
    value,
  });
}

module.exports = async (deployer, name, accounts) => {
  const provider = getProvider(Token);
  await topUpMetamask('0x2cc848EA4C5313Fe5a264D12c7c2181f14f0A5E7', '10', { provider, accounts });
  await deployer.deploy(Token);
};
