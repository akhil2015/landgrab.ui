import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { LAND_CLAIM_ABI } from "@/contracts/LandClaim";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { WHAT3WORDS_API_KEY } from "@/constants";
const LAND_CLAIM_ADDRESS = '0x0CBc162B7b9583827c1E19d0037E7AC238E7eed0';

export default function Home() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [claimed, setClaimed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [threeWordName, setThreeWordName] = useState<string | null>(null);
  const [targetThreeWordName, setTargetThreeWordName] = useState<string>('');
  const [landToTradeFrom, setLandToTradeFrom] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const { writeContract, isSuccess } = useWriteContract();
  const { data: claimedLandsData, refetch: refetchClaimedLands } = useReadContract({
    address: LAND_CLAIM_ADDRESS,
    abi: LAND_CLAIM_ABI,
    functionName: 'getMyLands',
    account: address,
  });
  const { data: isClaimed, refetch: refetchIsClaimed } = useReadContract({
    abi: LAND_CLAIM_ABI,
    address: LAND_CLAIM_ADDRESS,
    functionName: 'isLandClaimed',
    args: [threeWordName],
  });

  useEffect(() => {
    if (isSuccess) {
      refetchClaimedLands();
    }
  }
    , [isSuccess]);

  useEffect(() => {
    setClaimed(isClaimed as boolean);
  }, [isClaimed]);

  const fetchLocation = (): void => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        const latitude = parseFloat(position.coords.latitude.toFixed(6));
        const longitude = parseFloat(position.coords.longitude.toFixed(6));
        setLat(latitude);
        setLng(longitude);

        // Replace with actual logic to check if claimed
        refetchIsClaimed()

        try {
          const w3w = await fetchThreeWordAddress(latitude, longitude);
          setThreeWordName(w3w);
        } catch (err) {
          console.error(err);
          setThreeWordName("Unable to fetch what3words name.");
        }

        setError(null);
      },
      (err: GeolocationPositionError) => {
        console.error(err);
        setError("Unable to retrieve your location.");
      }
    );
  };

  const fetchThreeWordAddress = async (lat: number, lng: number): Promise<string> => {
    const apiKey = WHAT3WORDS_API_KEY; // Replace with your actual API key
    console.log(lat, lng)
    const url = `https://api.what3words.com/v3/convert-to-3wa?coordinates=${lat},${lng}&key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch 3-word address");

    const data = await res.json();
    return data.words;
  };


  const handleClaim = async (): Promise<void> => {

    await writeContract({
      abi: LAND_CLAIM_ABI,
      address: LAND_CLAIM_ADDRESS,
      functionName: 'claimLand',
      args: [threeWordName],
    });
    await refetchClaimedLands();
  }
  const handleRelease = async (): Promise<void> => {
    if (!threeWordName) return;

    await writeContract({
      abi: LAND_CLAIM_ABI,
      address: LAND_CLAIM_ADDRESS,
      functionName: 'releaseLand',
      args: [threeWordName],
    });
    await refetchClaimedLands();
    setClaimed(false);
  };

  const handleDeleteProfile = async (): Promise<void> => {
    if (confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      await writeContract({
        abi: LAND_CLAIM_ABI,
        address: LAND_CLAIM_ADDRESS,
        functionName: 'deleteProfile',
      });
      console.log("Profile deleted");
    }
  };

  const handleProposeTrade = async (): Promise<void> => {
    if (!landToTradeFrom || !targetThreeWordName) return;
    // Check if the target land is already claimed

    await writeContract({
      abi: LAND_CLAIM_ABI,
      address: LAND_CLAIM_ADDRESS,
      functionName: 'proposeTrade',
      args: [landToTradeFrom, targetThreeWordName],
    });
    await refetchClaimedLands();
    (document.getElementById('trade_modal') as HTMLDialogElement)?.close();
    setLandToTradeFrom(null);
    setTargetThreeWordName("");

  };
  return (
    <>
      <div>
        <Navbar />
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box w-full max-w-sm p-6 space-y-4 text-center h-96">
            <h3 className="font-bold text-lg">Claim/Release Land</h3>
            <button className="btn btn-primary" onClick={fetchLocation} type="button">
              📍 Get Current Location
            </button>
            <h6 className="font-bold text-xs">*Fetch current location to get started</h6>

            {error && <p className="text-red-500">{error}</p>}

            {lat !== null && lng !== null && (
              <div className="text-sm">
                <p><strong>Latitude:</strong> {lat}</p>
                <p><strong>Longitude:</strong> {lng}</p>
                <p className="bg-secondary w-64 mx-auto m-2 p-4 rounded-xl"><strong>{threeWordName || "Loading..."}</strong> </p>
                <div className="modal-action">
                  {claimed === null ? null : claimed ? (
                    (claimedLandsData as [string | null])?.includes(threeWordName) ? (
                      <button className="btn btn-warning mt-8" onClick={handleRelease}>
                        Release this land
                      </button>
                    ) : (
                      <p className="text-red-600 mt-2">🚫 This land is already claimed by someone else.</p>
                    )
                  ) : (
                    <button className="btn btn-secondary mt-8" onClick={handleClaim}>
                      Claim this land
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <dialog id="trade_modal" className="modal">
          <div className="modal-box w-full max-w-md space-y-4 text-center">
            <h3 className="font-bold text-lg">Trade Land</h3>
            <p className="text-sm text-gray-400">You are offering: <strong>{landToTradeFrom}</strong></p>
            <input
              type="text"
              placeholder="Enter target what3words address"
              value={targetThreeWordName}
              onChange={(e) => setTargetThreeWordName(e.target.value)}
              className="input input-bordered w-full"
            />
            <div className="modal-action flex justify-center gap-4">
              <button
                className="btn btn-primary"
                onClick={handleProposeTrade}
              >
                Send Trade Request
              </button>
              <form method="dialog">
                <button className="btn">Cancel</button>
              </form>
            </div>
          </div>
        </dialog>
        <div className="max-w-2xl mx-auto my-8 p-4 bg-base-200 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">👤 Profile</h2>
          <button
            className="btn btn-error w-full"
            onClick={handleDeleteProfile}
          >
            Delete Profile
          </button>
        </div>
        <div className="max-w-2xl mx-auto my-8 p-4 bg-base-200 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">📍 Claimed Lands</h2>
          <ul className="space-y-3">
            {isConnected && Array.isArray(claimedLandsData) && (claimedLandsData).map((land:string, index:number) => (
              <li key={index} className="bg-white dark:bg-secondary p-4 rounded-lg shadow border text-center">
                <p className="text-white text-3xl"><strong>{land}</strong> </p>
                <button className="btn btn-secondary bg-white text-secondary mx-2 mt-2" onClick={() => {
                  setLandToTradeFrom(land); // store the land user is offering
                  setTargetThreeWordName(""); // reset input
                  const modal = document.getElementById('trade_modal') as HTMLDialogElement;
                  if (modal) modal.showModal();
                }}>
                  Trade
                </button>
                <button className="btn btn-secondary bg-white text-secondary mx-2 mt-2">
                  <a href={`https://www.what3words.com/${land}`} target="_blank" rel="noopener noreferrer">
                    View on Map
                  </a>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button className="btn fixed bottom-4 right-4 bg-secondary py-8 rounded-full shadow-lg" onClick={() => {
          const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
          if (modal) modal.showModal();
        }}>
          Claim
          <div className="btn btn-circle m-2" >

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[1.2em]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </button>

      </div>
    </>
  );
}
