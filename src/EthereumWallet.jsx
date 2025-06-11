import { useState } from "react";
import { HDNodeWallet, Mnemonic } from "ethers"

export function EthereumWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);

    const addWallet = async () => {
        //step1: create derivation path (ethereum uses coin type 60)
        const derivationPath = `m/44'/60'/${currentIndex}'/0'/0`;

        //Step 2: convert string to Mnemonic object
        const mnemonicObject = Mnemonic.fromPhrase(mnemonic);

        //Step 3: derive HD wallet
        const hdNode = HDNodeWallet.fromMnemonic(mnemonicObject, derivationPath);

        //step 4: get ethereum address
        const address = hdNode.address;

        //update state
        setCurrentIndex(currentIndex + 1);
        setAddresses([...addresses, address]);
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
                🔷 Ethereum Wallets
            </h3>

            <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium mb-4"
                onClick={addWallet}
                > 
                Add Wallet
            </button>

            <div className="space-y-2">
                {addresses.map((address, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-600">Wallet {index + 1}</p>
                        <p className="font-mono text-sm break-all">{address}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}