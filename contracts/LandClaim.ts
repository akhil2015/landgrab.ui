export const LAND_CLAIM_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tradeId",
				"type": "uint256"
			}
		],
		"name": "acceptTrade",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "words3",
				"type": "string"
			}
		],
		"name": "claimLand",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deleteProfile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "words3",
				"type": "string"
			}
		],
		"name": "LandClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "words3",
				"type": "string"
			}
		],
		"name": "LandReleased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "words3",
				"type": "string"
			}
		],
		"name": "LandTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "offeredLand",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "requestedLand",
				"type": "string"
			}
		],
		"name": "proposeTrade",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "words3",
				"type": "string"
			}
		],
		"name": "releaseLand",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tradeId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "accepter",
				"type": "address"
			}
		],
		"name": "TradeAccepted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tradeId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "proposer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "offeredLand",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "requestedLand",
				"type": "string"
			}
		],
		"name": "TradeProposed",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getMyLands",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "lands",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOffersForMe",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "offerIds",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOffersMadeByMe",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "tradeIds",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "words3",
				"type": "string"
			}
		],
		"name": "isLandClaimed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "landOwners",
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
		"name": "tradeCounter",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "trades",
		"outputs": [
			{
				"internalType": "address",
				"name": "proposer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "offeredLand",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "requestedLand",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userLands",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]