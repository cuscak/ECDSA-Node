import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function App() {
  const [balance, setBalance] = useState(0);
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState('NA');

  const msgHash = hashMessage('Doesnt matter');

  function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    return keccak256(bytes);
  }

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        signature={signature}
        setSignature={setSignature}
        recoveryBit={recoveryBit}
        setRecoveryBit={setRecoveryBit}
        msgHash={msgHash}
      />
      <Transfer setBalance={setBalance} signature={signature} recoveryBit={recoveryBit} msgHash={msgHash} />
    </div>
  );
}

export default App;
