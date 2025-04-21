import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { readContract } from '@wagmi/core'

import Navbar from "./components/Navbar";
import { LAND_CLAIM_ABI } from "@/contracts/LandClaim";
import {LAND_CLAIM_ADDRESS} from "@/constants";
import { config } from "@/lib/wagmi";
// Trade type
type Trade = {
  id: number;
  proposer: string;
  offeredLand: string;
  requestedLand: string;
  isActive: boolean;
};

export default function TradePage() {
  const { address } = useAccount();
  const [myOffers, setMyOffers] = useState<Trade[]>([]);
  const [incomingOffers, setIncomingOffers] = useState<Trade[]>([]);
  // Read trade IDs
  const { data: myOfferIds } = useReadContract({
    address: LAND_CLAIM_ADDRESS,
    abi: LAND_CLAIM_ABI,
    functionName: "getOffersMadeByMe",
    account: address,
  });

  const { data: incomingOfferIds } = useReadContract({
    address: LAND_CLAIM_ADDRESS,
    abi: LAND_CLAIM_ABI,
    functionName: "getOffersForMe",
    account: address,
  });

  const {writeContract: acceptTrade} = useWriteContract()

 // Helper to fetch individual trade info
 const fetchTrade = async (id: bigint): Promise<Trade> => {
    const res = await readContract(config, {
        address: LAND_CLAIM_ADDRESS,
        abi: LAND_CLAIM_ABI,
        functionName: "trades",
        args: [id],
        } as const
    );
    console.log("Trade data",res)

    const [proposer, offeredLand, requestedLand, isActive] = res as [
      string,
      string,
      string,
      boolean
    ];

    return {
      id: Number(id),
      proposer,
      offeredLand,
      requestedLand,
      isActive,
    };
  };

  // Load all offers
  useEffect(() => {
    const loadTrades = async () => {
      if (!myOfferIds || !incomingOfferIds) return;

      const myOffersFetched = await Promise.all(
        (myOfferIds as bigint[]).map(fetchTrade)
      );

      const incomingFetched = await Promise.all(
        (incomingOfferIds as bigint[]).map(fetchTrade)
      );

      setMyOffers(myOffersFetched);
      setIncomingOffers(incomingFetched);
    };

    loadTrades();
  }, [myOfferIds, incomingOfferIds]);

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📦 Trade Center</h1>

        {/* Offers Made By Me */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">🔁 Offers Made by Me</h2>
          {myOffers?.length === 0 ? (
            <p className="text-gray-500">You haven’t made any trade offers yet.</p>
          ) : (
            <ul className="space-y-4">
              {myOffers?.map((trade) => (
                <li
                  key={trade.id}
                  className="p-4 border rounded-xl bg-base-100 shadow-sm"
                >
                  <p>
                    <strong>Offered:</strong> {trade.offeredLand}
                  </p>
                  <p>
                    <strong>Requested:</strong> {trade.requestedLand}
                  </p>
                  <p
                    className={`text-sm ${
                      trade.isActive ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {trade.isActive ? "⏳ Active" : "✅ Completed"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Offers From Others */}
        <section>
          <h2 className="text-xl font-semibold mb-4">📬 Offers for Me</h2>
          {incomingOffers?.length === 0 ? (
            <p className="text-gray-500">You haven’t received any offers yet.</p>
          ) : (
            <ul className="space-y-4">
              {incomingOffers?.map((trade) => (
                <li
                  key={trade.id}
                  className="p-4 border rounded-xl bg-secondary text-white shadow-sm"
                >
                  <p>
                    <strong>They offer:</strong> {trade.offeredLand}
                  </p>
                  <p>
                    <strong>They want:</strong> {trade.requestedLand}
                  </p>
                  <button
                    className="btn btn-sm btn-neutral mt-2"
                    onClick={() => acceptTrade({
                        address: LAND_CLAIM_ADDRESS,
                        abi: LAND_CLAIM_ABI,
                        functionName: "acceptTrade",
                        args: [trade.id],
                    })}
                  >
                    ✅ Accept Trade
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
