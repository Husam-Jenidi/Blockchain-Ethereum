import { ethers } from "./ethers-5.1.esm.min.js";

let provider;
let signer;
let contract;

const contractAddress = "0x3D4C1e8C84F918d6F7eFC31a6170EbfDde99C01f"; // Replace with your deployed contract address
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "challengeId",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "score",
                "type": "uint256"
            }
        ],
        "name": "ChallengeCompleted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "challengeId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "flag",
                "type": "string"
            }
        ],
        "name": "addFlag",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            }
        ],
        "name": "getScore",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "scores",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "challengeId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "flag",
                "type": "string"
            }
        ],
        "name": "submitFlag",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

//connect the wallet
document.getElementById('connectWallet').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Initialize ethers provider and signer
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();

            // Initialize contract instance
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            document.getElementById('status').innerText = 'Wallet connected';
        } catch (error) {
            console.error(error);
            document.getElementById('status').innerText = 'Failed to connect wallet';
        }
    } else {
        console.error('MetaMask is not installed');
        document.getElementById('status').innerText = 'MetaMask is not installed';
    }
});

//disconnect the wallet
document.getElementById('disconnectWallet').addEventListener('click', () => {
    provider = null;
    signer = null;
    contract = null;
    document.getElementById('status').innerText = 'Wallet disconnected';
    document.getElementById('score').innerText = '00000'; // Reset score display
});

document.getElementById('submitFlag').addEventListener('click', async () => {
    const challengeId = document.getElementById('challengeId').value;
    const flag = document.getElementById('flag').value;
    try {
        const tx = await contract.submitFlag(challengeId, flag);
        await tx.wait();
        document.getElementById('flag-status').innerText = 'Flag submitted successfully';
        updateScore();
    } catch (error) {
        console.error(error);
        document.getElementById('flag-status').innerText = 'Failed to submit flag';
    }
});

async function updateScore() {
    try {
        const address = await signer.getAddress();
        const score = await contract.getScore(address);
        document.getElementById('score').innerText = `Your score: ${score.toString()}`;
    } catch (error) {
        console.error(error);
        document.getElementById('score').innerText = 'Failed to retrieve score';
    }
}
