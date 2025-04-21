import { http, createConfig } from 'wagmi'
import { base, mainnet,polygonAmoy,sepolia } from 'wagmi/chains'
import { injected, metaMask, safe } from 'wagmi/connectors'


export const config = createConfig({
  chains: [mainnet, base, polygonAmoy, sepolia],
  connectors: [
    injected(),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygonAmoy.id]: http(),
    [sepolia.id]: http(),
  },
})