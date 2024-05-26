import { ethers } from "./ethers-5.1.esm.min.js";

let provider;
let signer;
let contract;
						 
const contractAddress = "0x655266c46842e95b02168787cb83E6A9952CE03a"; 
const contractABI =[
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
		"name": "submitFlag",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllPlayersAndScores",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
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
		"inputs": [],
		"name": "playerAddress",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
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
			updateScore();
            getDashboard();
			
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

document.getElementById('clearInputs').addEventListener('click', async () => {
	document.getElementById('challengeId').value = null; 
    document.getElementById('flag').value = null; 


});


document.getElementById('submitFlag').addEventListener('click', async () => {
    if(!contract){
    document.getElementById('flag-status').innerText="Please connect your wallet first";
    return;
    }
    const challengeId = document.getElementById('challengeId').value;
    const flag = document.getElementById('flag').value;

    if (!challengeId || !flag){
        document.getElementById('flag-status').innerText ="Please enter both challengeId and flag";
        return;
    }
    try {
		const flagHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['string', 'string'], [challengeId, flag]));

        const tx = await contract.submitFlag(challengeId, flag);
        await tx.wait();
        document.getElementById('flag-status').innerText = 'Flag submitted successfully';
        updateScore();
    } catch (error) {
        console.error(error);
        if (error.code === -32603 && error.message.includes('execution reverted: Invalid flag')){
            document.getElementById('flag-status').innerText = 'Invalid Flag, try again';
        }
        else {
            document.getElementById('flag-status').innerText = 'Failed to submit flag';
        }
    
    }
});

async function updateScore() {
    try {
        const address = await signer.getAddress();
        const score = await contract.getScore(address);
        document.getElementById('score').innerText = `Your score: ${score.toString()}`;
		getDashboard();
    } catch (error) {
        console.error(error);
        document.getElementById('score').innerText = 'Failed to retrieve score';
		
    }
}

document.getElementById('addFlag').addEventListener('click', async () => {
    const challengeId = document.getElementById('challengeId').value;
    const flag = document.getElementById('flag').value;
    try {
        const tx = await contract.addFlag(challengeId, flag);
        await tx.wait();
        console.log('Flag added successfully');
    } catch (error) {
        console.error(error);
        alert('Failed to add flag');
    }
});

async function getDashboard(){

	try{
		const [players,scores] = await contract.getAllPlayersAndScores();
		const playerContainer = document.getElementById('players');
		const playerAddress = await contract.playerAddress();
		playerContainer.innerHTML ='';

		for (let i=0;i< players.length;i++){
			
			const playerElement= document.createElement('div');
			playerElement.innerText= `Address: ${players[i]}, Score: ${scores[i].toString()}`;
			playerContainer.appendChild(playerElement);
			if (players[i]==playerAddress) {playerElement.style.color = "blue"}
		}
	}
	catch(error){
		console.error(error);
		alert('failed to fetch plater data');

	}
}
