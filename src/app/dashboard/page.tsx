'use client';

import { useAuth } from '@/contexts/AuthContext';
import { MetricCard } from '@/components/MetricCard';
import { BarChart3, Target, Trophy, TrendingUp, Calendar, Users } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();

    const stats = user?.stats;

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Here's an overview of your performance and progress.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Average Score"
                    value={stats?.average_score || 0}
                    icon={BarChart3}
                    color="green"
                    trend={{ value: 5.2, isPositive: true }}
                />
                <MetricCard
                    title="High Game"
                    value={stats?.high_game || 0}
                    icon={Target}
                    color="blue"
                />
                <MetricCard
                    title="High Series"
                    value={stats?.high_series || 0}
                    icon={Trophy}
                    color="green"
                />
                <MetricCard
                    title="Experience Points"
                    value={stats?.experience || 0}
                    icon={TrendingUp}
                    color="green"
                    trend={{ value: 12.8, isPositive: true }}
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Games</h2>
                    <div className="space-y-4">
                        {[
                            { date: '2025-06-26', score: 185, series: 545 },
                            { date: '2025-06-25', score: 172, series: 521 },
                            { date: '2025-06-24', score: 168, series: 498 },
                            { date: '2025-06-23', score: 192, series: 567 },
                        ].map((game, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{game.date}</p>
                                        <p className="text-sm text-gray-600">Game Score: {game.score}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">{game.series}</p>
                                    <p className="text-xs text-gray-500">Series</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                        View All Games
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Goals & Achievements</h2>
                    <div className="space-y-4">
                        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                            <div className="flex items-center gap-3 mb-2">
                                <Trophy className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-800">Current Goal</span>
                            </div>
                            <p className="text-sm text-green-700 mb-2">Achieve 200+ average</p>
                            <div className="w-full bg-green-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${((stats?.average_score || 0) / 200) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                                {Math.round(((stats?.average_score || 0) / 200) * 100)}% complete
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-900">Recent Achievements</h3>
                            {[
                                { name: 'First Century', description: 'Scored 100+ in a game', icon: '🎯' },
                                { name: 'Consistent Player', description: 'Played 5 games this week', icon: '🏆' },
                                { name: 'Personal Best', description: 'New high score achieved', icon: '⭐' },
                            ].map((achievement, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <span className="text-lg">{achievement.icon}</span>
                                    <div>
                                        <p className="font-medium text-gray-900">{achievement.name}</p>
                                        <p className="text-sm text-gray-600">{achievement.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Log New Game</p>
                            <p className="text-sm text-gray-600">Record your latest scores</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">View Analytics</p>
                            <p className="text-sm text-gray-600">Analyze your performance</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Find Players</p>
                            <p className="text-sm text-gray-600">Connect with others</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
