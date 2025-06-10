import { useState } from "react";
import { generateMnemonic } from "bip39";
import { SolanaWallet } from "./SolanaWallet";

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState([]);

  const generateSeedPhrase = () => {
    const fakeMnemonic = generateMnemonic();
    setMnemonic(fakeMnemonic);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        🪙 My Web Wallet
      </h1>

      {/* Seed phrase Generation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mt-0 mb-4">
          Step 1: Generate Seed Phrase
        </h2>
        <p className="text-gray-600 mb-4">
          <strong>Web3 Concept:</strong> Seed phrases basically generate wallet addresses for multiple blockchains.
        </p>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          onClick={generateSeedPhrase}
        >
          Generate Seed Phrase
        </button>

        {mnemonic && (
          <div className="bg-white border-2 border-blue-600 rounded-lg p-4 mt-4">
            <p className="mb-2 font-medium">Your seed phrase:</p>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 font-mono text-sm break-words">
              {mnemonic}
            </div>
            <p className="text-red-600 text-xs mt-2">
              ⚠️ <strong>Do NOT share this phrase with anyone.</strong> It controls all your wallets.
            </p>
          </div>
        )}
      </div>

      {/* Wallet creation */}
      {mnemonic && <SolanaWallet mnemonic={mnemonic} />}
    </div>
  );
}

export default App;
