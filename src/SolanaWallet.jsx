import { useState } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { mnemonicToSeed } from "bip39";

export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);
    const [privateKeys, setPrivateKeys] = useState([]);
    const [showPrivateKeys, setShowPrivateKeys] = useState(false);
    const [balances, setBalances] = useState([]);

    const fetchBalance = async (publicKey) => {
        try {
            const response = await fetch('https://api.mainnet-beta.solana.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getBalance',
                    params: [publicKey]
                })
            });
            const data = await response.json();
            return data.result.value / 1000000000;
        } catch (error) {
            console.error('Error fetching Solana Balance:', error);
            return 0;
        }
    };

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

        //Get private key (base58 format for Solana)
        const privateKey = keypair.secretKey;
        const privateKeyBase58 = Buffer.from(privateKey).toString('base64');

        const balance = await fetchBalance(publicKey);
        setBalances([...balances, balance]);

        setCurrentIndex(currentIndex + 1);
        setPublicKeys([...publicKeys, publicKey]);
        setPrivateKeys([...privateKeys, privateKeyBase58]);

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

            <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium mb-4 ml-2"
                onClick={() => setShowPrivateKeys(!showPrivateKeys)}
            >
               {showPrivateKeys ? "Hide" : "Show"} Private Keys ⚠️
            </button>

            {showPrivateKeys && (
                <div className="bg-red-50 border border-red-300 rounded p-3 mb-4">
                    <p className="text-red-800 text-sm font-bold mb-2">
                        Never share your private keys
                    </p>
                </div>
            )}
            
            <div className="space-y-2">
                {publicKeys.map((publicKey, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-600">Solana Wallet {index + 1}</p>
                        <p>Balance: {balances[index]?.toFixed(4) || '0.0000'} SOL</p>
                        <p className="font-mono text-sm break-all">{publicKey}</p>
                    {showPrivateKeys && (
                        <p className="font-mono text-sm break-all text-red-600">
                            Private Key: {privateKeys[index]}
                        </p>
                    )}
                    </div>
                ))}
            </div>
        </div>
    )
}