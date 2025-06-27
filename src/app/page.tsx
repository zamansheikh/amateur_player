import Link from 'next/link';
import { Trophy, Star, TrendingUp } from 'lucide-react';

export default function HomePage() {
    // Mock leaderboard data
    const legends = [
        { name: 'Alex Johnson', username: '@alexj', level: 25, xp: 3456, rank: 2, avatar: 'AJ' },
        { name: 'Sarah Chen', username: '@sarahc', level: 28, xp: 4125, rank: 1, avatar: 'SC', isTop: true },
        { name: 'Mike Torres', username: '@miket', level: 23, xp: 2987, rank: 3, avatar: 'MT' },
    ];

    const risingStars = [
        { name: 'Emma Wilson', username: '@emma', level: 18, xp: 2234, rank: 4, avatar: 'EW' },
        { name: 'David Park', username: '@david', level: 17, xp: 2156, rank: 5, avatar: 'DP' },
        { name: 'Lisa Brown', username: '@lisa', level: 16, xp: 2089, rank: 6, avatar: 'LB' },
        { name: 'James Lee', username: '@james', level: 15, xp: 1987, rank: 7, avatar: 'JL' },
        { name: 'Anna Smith', username: '@anna', level: 14, xp: 1876, rank: 8, avatar: 'AS' },
        { name: 'Tom Davis', username: '@tom', level: 13, xp: 1765, rank: 9, avatar: 'TD' },
        { name: 'Kate Miller', username: '@kate', level: 12, xp: 1654, rank: 10, avatar: 'KM' },
        { name: 'Ryan Clark', username: '@ryan', level: 11, xp: 1543, rank: 11, avatar: 'RC' },
        { name: 'Sophie White', username: '@sophie', level: 10, xp: 1432, rank: 12, avatar: 'SW' },
        { name: 'Jack Taylor', username: '@jack', level: 9, xp: 1321, rank: 13, avatar: 'JT' },
        { name: 'Mia Garcia', username: '@mia', level: 8, xp: 1210, rank: 14, avatar: 'MG' },
        { name: 'Ben Martinez', username: '@ben', level: 7, xp: 1099, rank: 15, avatar: 'BM' },
    ];

    const PlayerCard = ({ player, size = 'normal' }: { player: any, size?: 'normal' | 'large' }) => {
        const isLarge = size === 'large';
        const cardClass = isLarge
            ? "bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-2xl transform scale-105 relative"
            : "bg-gradient-to-br from-green-500 to-green-700 text-white p-4 rounded-xl shadow-lg";

        const avatarClass = isLarge ? "w-16 h-16 text-2xl" : "w-12 h-12 text-lg";

        return (
            <div className={cardClass}>
                {isLarge && (
                    <div className="absolute -top-2 -right-2">
                        <div className="bg-yellow-400 rounded-full p-2">
                            <Trophy className="w-6 h-6 text-yellow-800" />
                        </div>
                    </div>
                )}

                <div className="text-center">
                    <div className={`${avatarClass} bg-white bg-opacity-20 rounded-full mx-auto flex items-center justify-center font-bold mb-3`}>
                        {player.avatar}
                    </div>

                    <h3 className={`font-bold ${isLarge ? 'text-xl' : 'text-lg'} mb-1`}>
                        {player.name}
                    </h3>
                    <p className={`text-green-100 ${isLarge ? 'text-base' : 'text-sm'} mb-3`}>
                        {player.username}
                    </p>

                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <p className="text-green-100 text-xs">Level</p>
                            <p className={`font-bold ${isLarge ? 'text-2xl' : 'text-xl'}`}>
                                {player.level}
                            </p>
                        </div>
                        <div>
                            <p className="text-green-100 text-xs">XP</p>
                            <p className={`font-bold ${isLarge ? 'text-2xl' : 'text-xl'}`}>
                                {player.xp}
                            </p>
                        </div>
                    </div>

                    <div className={`bg-white bg-opacity-20 rounded-full px-3 py-1 ${isLarge ? 'text-base' : 'text-sm'} font-medium`}>
                        {player.rank === 1 ? '1st Place' :
                            player.rank === 2 ? '2nd Place' :
                                player.rank === 3 ? '3rd Place' :
                                    `Rank ${player.rank}`}
                        {player.rank <= 3 && <span className="ml-1">🏆</span>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header Section */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            <span style={{
                                background: 'linear-gradient(to right, #8BC342, #6fa332)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Amateur Player
                            </span>
                        </h1>
                        <p className="text-gray-600">
                            Join the community and climb the leaderboards
                        </p>
                    </div>
                </div>
            </div>

            {/* Meet the Legends Section */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-3xl font-bold text-gray-900">Meet the Legends</h2>
                        </div>
                        <p className="text-gray-600">The podium of greatness - only the elite stand here.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-end justify-center gap-6 mb-12">
                        {/* 2nd Place */}
                        <div className="order-1 lg:order-1">
                            <PlayerCard player={legends[0]} />
                        </div>

                        {/* 1st Place - Larger and elevated */}
                        <div className="order-2 lg:order-2">
                            <PlayerCard player={legends[1]} size="large" />
                        </div>

                        {/* 3rd Place */}
                        <div className="order-3 lg:order-3">
                            <PlayerCard player={legends[2]} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Rising Stars Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            <h2 className="text-3xl font-bold text-gray-900">Rising Stars</h2>
                        </div>
                        <p className="text-gray-600">Keep an eye on these top 20 cards - legends in the making.</p>
                    </div>

                    {/* Horizontally scrollable container */}
                    <div className="relative">
                        <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide" style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}>
                            {risingStars.map((player, index) => (
                                <div key={index} className="flex-shrink-0 w-48">
                                    <PlayerCard player={player} />
                                </div>
                            ))}
                        </div>

                        {/* Gradient fade effects on sides */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Join the Competition?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Create your account and start climbing the leaderboards today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                        >
                            Join Now
                        </Link>
                        <Link
                            href="/signin"
                            className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
