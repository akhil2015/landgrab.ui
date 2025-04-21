# LandClaim DApp Design Document

## Overview

**LandClaim** is a decentralized application that allows users to claim virtual land based on [what3words](https://what3words.com/) 3-word geocoding, trade land with other users, and release ownership. It uses Ethereum smart contracts and a Next.js frontend.

---

## Goals

- Enable users to **claim** and **own** 3m x 3m virtual land using 3-word addresses.
- Allow **land-for-land trades** between users.
- Provide functionality for users to **release** or **delete** their profile and associated lands.
- Visualize claimed lands and trade offers.
- Ensure fair ownership rules (e.g., no claiming already claimed land).

---

## Smart Contract: `LandClaim.sol`

### Key Data Structures

```solidity
struct Trade {
  address proposer;
  string offeredLand;
  string requestedLand;
  bool isActive;
}
```

### State Variables

- `mapping(string => address) landOwners`
- `mapping(address => string[]) userLands`
- `mapping(uint256 => Trade) trades`
- `uint256 tradeCounter`

---

### Key Functions

| Function | Purpose |
|---------|---------|
| `claimLand(string)` | Claim an unowned land |
| `proposeTrade(string, string)` | Offer a land-for-land trade |
| `acceptTrade(uint256)` | Accept a trade and swap lands |
| `releaseLand(string)` | Give up ownership of land |
| `deleteProfile()` | Release all user lands |
| `getMyLands()` | Return user's owned lands |
| `getOffersForMe()` | Return trades proposing to take your land |
| `getOffersMadeByMe()` | Return trades you proposed |

---

## Frontend: `Next.js + TypeScript`

### Pages & Components

#### `pages/index.tsx`
- Landing page
- Connect Wallet button
- Navigation to dashboard

#### `components/Claim.tsx`
- Input for claiming new land
- Displays claim status

#### `components/MyLands.tsx`
- Displays claimed land
- Buttons: View on Map, Trade
- Opens modal to propose trade

#### `components/TradeModal.tsx`
- Input requested 3-word land
- Propose trade via contract call

#### `components/TradeInbox.tsx`
- Show incoming trades with Accept button

#### `components/DeleteProfile.tsx`
- Calls `deleteProfile()` to release all land

---

## Contract Security

- Prevent claiming of already claimed land.
- Require ownership before releasing or offering trade.
- Prevent trade of land with self.
- Ownership verified during trade acceptance.

---

## Future Improvements

- Add forced takeover logic for surrounded land
- Visual land map interface
- Land auction and buy/sell market
- Role-based land zones (e.g., farming, mining)
- Anti-bot protections for claim & trade

---

## Dependencies

- Solidity `^0.8.20`
- Next.js
- Ethers.js or Wagmi
- TailwindCSS for styling
- MetaMask for user interaction

---
