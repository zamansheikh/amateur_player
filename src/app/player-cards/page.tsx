'use client';

import PlayerProfileCard from '@/components/PlayerProfileCard';

export default function PlayerCardTestPage() {
    const testPlayers = [
        {
            id: 1,
            name: "Jason Belmonte",
            level: 3,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jason",
            isFollowing: false,
            stats: [
                { label: "PAC", value: "97" },
                { label: "SHO", value: "89" },
                { label: "PAS", value: "92" },
                { label: "DRB", value: "85" },
                { label: "DEF", value: "78" },
                { label: "PHY", value: "88" }
            ]
        },
        {
            id: 2,
            name: "Norm Duke",
            level: 5,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Norm",
            isFollowing: true,
            stats: [
                { label: "PAC", value: "94" },
                { label: "SHO", value: "91" },
                { label: "PAS", value: "88" },
                { label: "DRB", value: "82" },
                { label: "DEF", value: "95" },
                { label: "PHY", value: "90" }
            ]
        },
        {
            id: 3,
            name: "Sean Rash",
            level: 4,
            isFollowing: false,
            stats: [
                { label: "PAC", value: "93" },
                { label: "SHO", value: "87" },
                { label: "PAS", value: "91" },
                { label: "DRB", value: "86" },
                { label: "DEF", value: "81" },
                { label: "PHY", value: "92" }
            ]
        }
    ];

    const handleFollow = async (playerId: number) => {
        console.log(`Following/unfollowing player ${playerId}`);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Player Profile Cards
                    </h1>
                    <p className="text-xl text-gray-600">
                        Shield-shaped player cards with professional stats and follow functionality
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {testPlayers.map((player) => (
                        <PlayerProfileCard
                            key={player.id}
                            player={player}
                            onFollow={handleFollow}
                            className="hover:scale-105 transition-transform duration-300"
                        />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Component Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-blue-900">Design Features:</h3>
                                <ul className="text-gray-600 space-y-1">
                                    <li>• Shield-shaped card design</li>
                                    <li>• Level badge with large number</li>
                                    <li>• Circular avatar with fallback initials</li>
                                    <li>• Clean typography and spacing</li>
                                    <li>• Professional blue color scheme</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-blue-900">Interactive Features:</h3>
                                <ul className="text-gray-600 space-y-1">
                                    <li>• Follow/unfollow functionality</li>
                                    <li>• Loading states with spinner</li>
                                    <li>• Hover animations and transitions</li>
                                    <li>• Grid layout for player stats</li>
                                    <li>• TypeScript type safety</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
