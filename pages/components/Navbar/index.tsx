import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const Navbar: React.FC = () => {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null; // Prevents SSR mismatch

    const truncateAddress = (addr: string) =>
        `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

    return (
        <nav>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li onClick={() => router.push('/trade')}><a>Trade</a></li>
                            <li>
                                <a>Documentation</a>
                                <ul className="p-2">
                                    <li><a>github</a></li>
                                    <li><a>what3words</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-xl" onClick={() => router.push('/')}>LANDgrab</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li onClick={() => router.push('/trade')}><a>Trade</a></li>
                        <li>
                            <details>
                                <summary>Documentation</summary>
                                <ul className="p-2">
                                    <li><a>github</a></li>
                                    <li><a>what3words</a></li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
                <div className="navbar-end">
                    {isConnected ? (
                        <div className="flex gap-2 items-center">
                            <span className="btn btn-outline btn-primary cursor-default">
                                {truncateAddress(address!)}
                            </span>
                            <button className="btn btn-error btn-sm" onClick={() => disconnect()}>
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                connect({
                                    connector: connectors[1], // Use Metamask connector (adjust index as needed)
                                });
                            }}
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
