import { useState } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);

    return (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
                Solana Wallets
            </h3>

            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium mb-4"
                onClick={() => {
                    console.log("Adding Solana wallet...");
                }}
                >
                Add Wallet
            </button>

            <div>
                {publicKeys.map((publicKey, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-600">Wallet {index + 1}</p>
                        <p className="font-mono text-sm break-all">{publicKey}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}