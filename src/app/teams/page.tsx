'use client';

import { useState } from 'react';
import { Plus, X, Search, MessageCircle, Upload } from 'lucide-react';

interface Team {
    id: number;
    name: string;
    members: number;
    createdAt: string;
    avatar?: string;
}

interface Member {
    id: number;
    name: string;
    avatar?: string;
    selected?: boolean;
}

export default function TeamsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSelectingMembers, setIsSelectingMembers] = useState(false);

    // Mock teams data
    const [teams, setTeams] = useState<Team[]>([
        { id: 1, name: 'Teams Name', members: 5, createdAt: 'Created 7 days ago' },
        { id: 2, name: 'Teams Name', members: 5, createdAt: 'Created 7 days ago' },
        { id: 3, name: 'Teams Name', members: 5, createdAt: 'Created 7 days ago' },
        { id: 4, name: 'Teams Name', members: 5, createdAt: 'Created 7 days ago' },
        { id: 5, name: 'Teams Name', members: 5, createdAt: 'Created 7 days ago' },
        { id: 6, name: 'Teams Name', members: 5, createdAt: 'Created 7 days ago' },
        { id: 7, name: 'Teams Name', members: 5, createdAt: 'Created 7 days ago' },
    ]);

    // Mock members data
    const availableMembers: Member[] = [
        { id: 1, name: 'Ronald Richards' },
        { id: 2, name: 'Ronald Richards' },
        { id: 3, name: 'Ronald Richards' },
        { id: 4, name: 'Ronald Richards' },
        { id: 5, name: 'John Smith' },
        { id: 6, name: 'Jane Doe' },
        { id: 7, name: 'Mike Johnson' },
        { id: 8, name: 'Sarah Wilson' },
    ];

    const filteredMembers = availableMembers.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateTeam = () => {
        if (teamName.trim()) {
            const newTeam: Team = {
                id: teams.length + 1,
                name: teamName,
                members: selectedMembers.length,
                createdAt: 'Created just now'
            };
            setTeams([...teams, newTeam]);
            setIsCreateModalOpen(false);
            setTeamName('');
            setSelectedMembers([]);
            setIsSelectingMembers(false);
            setSearchQuery('');
        }
    };

    const handleMemberToggle = (memberId: number) => {
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleSelectMemberClick = () => {
        setIsSelectingMembers(true);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Teams</h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Communications from bowling centers, manufacturers, and BowlersNetwork
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Overview"
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Teams Count and Create Button */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">{teams.length} Teams</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create new Team
                </button>
            </div>

            {/* Teams List */}
            <div className="space-y-4">
                {teams.map((team) => (
                    <div key={team.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-500 text-lg">👥</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="text-blue-600">{team.members} Members</span>
                                        <span>{team.createdAt}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                                <span className="text-gray-600 text-lg">⚙️</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Team Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Create New Team</h2>
                            <button
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setTeamName('');
                                    setSelectedMembers([]);
                                    setIsSelectingMembers(false);
                                    setSearchQuery('');
                                }}
                                className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-red-600" />
                            </button>
                        </div>

                        {/* Team Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Team Name
                            </label>
                            <input
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="Team Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Select Member */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Member
                            </label>
                            
                            {!isSelectingMembers ? (
                                <button
                                    onClick={handleSelectMemberClick}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-between"
                                >
                                    <span>Select bowler..</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            ) : (
                                <div className="border border-gray-300 rounded-lg p-3">
                                    {/* Search */}
                                    <div className="relative mb-3">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="search bowler..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Members List */}
                                    <div className="max-h-48 overflow-y-auto space-y-2">
                                        {filteredMembers.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                                                onClick={() => handleMemberToggle(member.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className="text-gray-500 text-sm">👤</span>
                                                    </div>
                                                    <span className="text-gray-900">{member.name}</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembers.includes(member.id)}
                                                    onChange={() => handleMemberToggle(member.id)}
                                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Upload Image */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Image
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">Click to upload or drag and drop</p>
                            </div>
                        </div>

                        {/* Create Button */}
                        <button
                            onClick={handleCreateTeam}
                            disabled={!teamName.trim()}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Create Team
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
