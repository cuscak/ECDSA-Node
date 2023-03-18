import server from "./server";
import { useState } from "react";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({ signature, setSignature, balance, setBalance, recoveryBit, setRecoveryBit, msgHash }) {

  const [showBalance, setShowBalance] = useState(false);
  const [showError, setShowError] = useState('');

  function onChange(evt) {
    setShowError('');
    const signature = evt.target.value;
    setSignature(signature);
  }

  function onRecoveryChange(evt) {
    setShowError('');
    const recBit = evt.target.value;
    setRecoveryBit(recBit)
  }

  async function getBalance() {
    setShowError('');

    if (signature === "" && (recoveryBit === "NA" || recoveryBit === "")) {
      setShowError('Please provide signature and recovery bit');
      return;
    }

    if (signature === "") {  //TODO add check for lenghts...
      setShowError('Please provide signature');
      return;
    }

    if (recoveryBit === "NA") {
      setShowError('Please provide correct recovery bit.');
      return;
    }

    try {
      const recBit = parseInt(recoveryBit);

      const publicKey = secp.recoverPublicKey(msgHash, hexToBytes(signature), recBit);
      const address = toHex(keccak256(publicKey.slice(1,)).slice(-20));

      const {
        data: { balance },
      } = await server.get(`balance/${address}`);

      setBalance(balance);
      setShowBalance(true);

    } catch (err) {
      setShowError(err.message)
    }

  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Signature
        <input placeholder="Paste in any signed message" value={signature} onChange={onChange}></input>
      </label>

      <label>
        Reovery Bit
        <input placeholder="Type a Recovery Bit to verify your Address" value={recoveryBit} onChange={onRecoveryChange}></input>
      </label>

      <input type="submit" className="button" value="Show Balance" onClick={getBalance} />

      {showBalance && <div className="balance">Balance: {balance}</div>}
      {showError && <div className="error">Error: {showError}</div>}

    </div>
  );
}

export default Wallet;
