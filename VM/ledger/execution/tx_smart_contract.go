package execution

import (
	"fmt"
	"math/big"

	"github.com/thetatoken/theta/blockchain"
	"github.com/thetatoken/theta/common"
	"github.com/thetatoken/theta/common/result"
	"github.com/thetatoken/theta/core"
	st "github.com/thetatoken/theta/ledger/state"
	"github.com/thetatoken/theta/ledger/types"
	"github.com/thetatoken/theta/ledger/vm"
)

var _ TxExecutor = (*SmartContractTxExecutor)(nil)

// ------------------------------- SmartContractTx Transaction -----------------------------------

// SmartContractTxExecutor implements the TxExecutor interface
type SmartContractTxExecutor struct {
	state *st.LedgerState
	chain *blockchain.Chain
}

// NewSmartContractTxExecutor creates a new instance of SmartContractTxExecutor
func NewSmartContractTxExecutor(chain *blockchain.Chain, state *st.LedgerState) *SmartContractTxExecutor {
	return &SmartContractTxExecutor{
		state: state,
		chain: chain,
	}
}

func (exec *SmartContractTxExecutor) sanityCheck(chainID string, view *st.StoreView, transaction types.Tx) result.Result {
	tx := transaction.(*types.SmartContractTx)

	// Validate from, basic
	res := tx.From.ValidateBasic()
	if res.IsError() {
		return res
	}

	// Get input account
	fromAccount, success := getInput(view, tx.From)
	if success.IsError() {
		return result.Error("Failed to get the account (the address has no Theta nor TFuel)")
	}

	// Validate input, advanced
	signBytes := tx.SignBytes(chainID)
	res = validateInputAdvanced(fromAccount, signBytes, tx.From)
	if res.IsError() {
		logger.Warnf(fmt.Sprintf("validateSourceAdvanced failed on %v: %v", tx.From.Address.Hex(), res))
		return res
	}

	coins := tx.From.Coins.NoNil()
	if !coins.IsNonnegative() {
		return result.Error("Invalid value to transfer").
			WithErrorCode(result.CodeInvalidValueToTransfer)
	}

	if !sanityCheckForGasPrice(tx.GasPrice) {
		return result.Error("Insufficient gas price. Gas price needs to be at least %v TFuelWei", types.MinimumGasPrice).
			WithErrorCode(result.CodeInvalidGasPrice)
	}

	if tx.GasLimit > types.MaximumTxGasLimit {
		return result.Error("Invalid gas limit. Gas limit needs to be at most %v", types.MaximumTxGasLimit).
			WithErrorCode(result.CodeInvalidGasLimit)
	}

	zero := big.NewInt(0)
	feeLimit := new(big.Int).Mul(tx.GasPrice, new(big.Int).SetUint64(tx.GasLimit))
	if feeLimit.BitLen() > 255 || feeLimit.Cmp(zero) < 0 {
		// There is no explicit upper limit for big.Int. Just be conservative
		// here to prevent potential overflow attack
		return result.Error("Fee limit too high").
			WithErrorCode(result.CodeFeeLimitTooHigh)
	}

	value := coins.TFuelWei // NoNil() already guarantees value is NOT nil
	minimalBalance := types.Coins{
		ThetaWei: zero,
		TFuelWei: feeLimit.Add(feeLimit, value),
	}
	if !fromAccount.Balance.IsGTE(minimalBalance) {
		logger.Infof(fmt.Sprintf("Source did not have enough balance %v", tx.From.Address.Hex()))
		return result.Error("Source balance is %v, but required minimal balance is %v",
			fromAccount.Balance, minimalBalance).WithErrorCode(result.CodeInsufficientFund)
	}

	return result.OK
}

func (exec *SmartContractTxExecutor) process(chainID string, view *st.StoreView, transaction types.Tx) (common.Hash, result.Result) {
	tx := transaction.(*types.SmartContractTx)

	view.ResetLogs()

	// Note: for contract deployment, vm.Execute() might transfer coins from the fromAccount to the
	//       deployed smart contract. Thus, we should call vm.Execute() before calling getInput().
	//       Otherwise, the fromAccount returned by getInput() will have incorrect balance.
	evmRet, contractAddr, gasUsed, evmErr := vm.Execute(exec.state.ParentBlock(), tx, view)

	fromAddress := tx.From.Address
	fromAccount, success := getInput(view, tx.From)
	if success.IsError() {
		return common.Hash{}, result.Error("Failed to get the from account")
	}

	feeAmount := new(big.Int).Mul(tx.GasPrice, new(big.Int).SetUint64(gasUsed))
	fee := types.Coins{
		ThetaWei: big.NewInt(int64(0)),
		TFuelWei: feeAmount,
	}
	if !chargeFee(fromAccount, fee) {
		return common.Hash{}, result.Error("failed to charge transaction fee")
	}

	createContract := (tx.To.Address == common.Address{})
	if !createContract { // vm.create() increments the sequence of the from account
		fromAccount.Sequence++
	}
	view.SetAccount(fromAddress, fromAccount)

	txHash := types.TxID(chainID, tx)

	// TODO: Add tx receipt: status and events
	logs := view.PopLogs()
	if evmErr != nil {
		// Do not record events if transaction is reverted
		logs = nil
	}
	exec.chain.AddTxReceipt(tx, logs, evmRet, contractAddr, gasUsed, evmErr)

	return txHash, result.OK
}

func (exec *SmartContractTxExecutor) getTxInfo(transaction types.Tx) *core.TxInfo {
	tx := transaction.(*types.SmartContractTx)
	return &core.TxInfo{
		Address:           tx.From.Address,
		Sequence:          tx.From.Sequence,
		EffectiveGasPrice: exec.calculateEffectiveGasPrice(transaction),
	}
}

func (exec *SmartContractTxExecutor) calculateEffectiveGasPrice(transaction types.Tx) *big.Int {
	tx := transaction.(*types.SmartContractTx)
	return tx.GasPrice
}
