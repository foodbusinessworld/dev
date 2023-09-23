const ChangeReferralAmount: React.FC = () => {
    return (<>
        <div className='m-withdraw'>
            {/* <h1>Request for withdraw</h1> */}
            <div className='m-withdraw1'>
                <div className="inputContainer">
                    <div className="input-field">
                        <input type="number" name="username"
                            // value={WithdrawAmount === 0 ? '' : WithdrawAmount}
                            // onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                            required spellCheck="false" />
                        <label>Enter Withdraw Amount</label>
                    </div>
                </div>
                <button className="W-Button"
                // onClick={() => WithdrawAmountFun()}
                >Submit</button>
            </div>
        </div>
    </>)
}

export default ChangeReferralAmount