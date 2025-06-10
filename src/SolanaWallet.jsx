import { useState } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { mnemonicToSeed } from "bip39";

export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);

    //actual derivation funcion
    const addWallet = async () => {
        // Step 1: Converting mnemonic to seed (512-bit)
        const seed = await mnemonicToSeed(mnemonic);

        // Step 2: Create derivation path
        const path = `m/44'/501'/${currentIndex}'/0'`; //building the path

        //Step 3: Derivep private key from seed + path
        const derivedSeed = derivePath(path, seed.toString("hex")).key;

        //Step 4: Generate Solana Keypair from derived seed
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);

        //Step 5 : get public address
        const publicKey = keypair.publicKey.toBase58();

        setCurrentIndex(currentIndex + 1);
        setPublicKeys([...publicKeys, publicKey]);
    }

    return (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
                Solana Wallets
            </h3>

            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium mb-4"
                onClick={() => {
                    addWallet();
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