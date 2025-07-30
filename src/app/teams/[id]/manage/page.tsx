'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Search, MessageCircle, Plus, X, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Member {
    user_id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture_url: string;
    intro_video_url: string;
    cover_photo_url: string;
    xp: number;
    level: number;
    card_theme: string;
}

interface TeamMember {
    member_id: number;
    member: Member;
    is_creator: boolean;
}

interface TeamDetails {
    team_id: number;
    name: string;
    logo_url: string;
    created_by: Member;
    created_at: string;
    team_chat_room_id: number;
    members: {
        member_count: number;
        members: TeamMember[];
    };
}

interface AvailableMember {
    user_id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture_url: string;
}

export default function TeamManagePage() {
    const router = useRouter();
    const params = useParams();
    const teamId = params.id as string;

    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [availableMembers, setAvailableMembers] = useState<AvailableMember[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showInviteSection, setShowInviteSection] = useState(false);

    // Fetch team details
    const fetchTeamDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/user/teams/${teamId}/members`);
            setTeam(response.data);
        } catch (error) {
            console.error('Error fetching team details:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch available members to invite
    const fetchAvailableMembers = async () => {
        try {
            const response = await api.get('/api/user-data');
            setAvailableMembers(response.data);
        } catch (error) {
            console.error('Error fetching available members:', error);
        }
    };

    useEffect(() => {
        if (teamId) {
            fetchTeamDetails();
            fetchAvailableMembers();
        }
    }, [teamId]);

    const filteredMembers = availableMembers.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !team?.members.members.some(teamMember => teamMember.member.user_id === member.user_id)
    );

    const handleMemberToggle = (userId: number) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleInviteMembers = async () => {
        if (selectedMembers.length === 0 || !team) return;

        try {
            setIsInviting(true);
            await Promise.all(
                selectedMembers.map(userId =>
                    api.post('/api/user/teams/invite', {
                        team_id: team.team_id,
                        invited_user_id: userId
                    })
                )
            );

            // Refresh team details
            await fetchTeamDetails();

            // Reset form
            setSelectedMembers([]);
            setSearchQuery('');
            setShowInviteSection(false);
            alert(`Successfully sent ${selectedMembers.length} invitation(s)!`);
        } catch (error) {
            console.error('Error sending invitations:', error);
            alert('Error sending invitations. Please try again.');
        } finally {
            setIsInviting(false);
        }
    };

    const handleTeamChat = () => {
        if (team?.team_chat_room_id) {
            router.push(`/messages?room=${team.team_chat_room_id}`);
        }
    };

    const handleDeleteTeam = async () => {
        if (!team || !confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/api/user/teams/${team.team_id}/delete`);
            router.push('/teams');
        } catch (error) {
            console.error('Error deleting team:', error);
            alert('Error deleting team. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Team not found</h2>
                    <button
                        onClick={() => router.push('/teams')}
                        className="text-green-600 hover:text-green-700"
                    >
                        Return to Teams
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/teams')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    {team.logo_url ? (
                                        <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                            <span className="text-white text-lg font-bold">
                                                {team.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
                                    <p className="text-gray-600">Team Management</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleTeamChat}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Open Chat
                            </button>
                            <button
                                onClick={handleDeleteTeam}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Team
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Team Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Information</h3>
                            
                            {/* Team Stats */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Team ID</span>
                                    <span className="font-medium text-gray-900">{team.team_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Members</span>
                                    <span className="font-medium text-gray-900">{team.members.member_count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created</span>
                                    <span className="font-medium text-gray-900">{team.created_at}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Chat Room ID</span>
                                    <span className="font-medium text-gray-900">{team.team_chat_room_id}</span>
                                </div>
                            </div>

                            {/* Team Creator */}
                            <div>
                                <h4 className="text-md font-semibold text-gray-900 mb-3">Team Creator</h4>
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        {team.created_by.profile_picture_url ? (
                                            <img src={team.created_by.profile_picture_url} alt={team.created_by.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                                <span className="text-white font-bold">
                                                    {team.created_by.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{team.created_by.name}</p>
                                        <p className="text-sm text-gray-600">@{team.created_by.username}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Members Management */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                                <button
                                    onClick={() => setShowInviteSection(!showInviteSection)}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Invite Members
                                </button>
                            </div>

                            {/* Invite Section */}
                            {showInviteSection && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-3">Invite New Members</h4>
                                    
                                    {/* Search */}
                                    <div className="relative mb-3">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search members to invite..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Available Members */}
                                    <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
                                        {filteredMembers.map((member) => (
                                            <div
                                                key={member.user_id}
                                                className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleMemberToggle(member.user_id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                                        {member.profile_picture_url ? (
                                                            <img src={member.profile_picture_url} alt={member.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                <span className="text-gray-500 text-sm">👤</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{member.name}</p>
                                                        <p className="text-sm text-gray-600">@{member.username}</p>
                                                    </div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembers.includes(member.user_id)}
                                                    onChange={() => handleMemberToggle(member.user_id)}
                                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                />
                                            </div>
                                        ))}
                                        {filteredMembers.length === 0 && (
                                            <p className="text-gray-500 text-center py-4">No available members to invite</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleInviteMembers}
                                            disabled={selectedMembers.length === 0 || isInviting}
                                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
                                        >
                                            {isInviting ? 'Sending...' : `Send ${selectedMembers.length} Invitation${selectedMembers.length !== 1 ? 's' : ''}`}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowInviteSection(false);
                                                setSelectedMembers([]);
                                                setSearchQuery('');
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Current Members */}
                            <div className="space-y-3">
                                {team.members.members.map((member) => (
                                    <div key={member.member_id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-12 h-12 rounded-full overflow-hidden">
                                            {member.member.profile_picture_url ? (
                                                <img src={member.member.profile_picture_url} alt={member.member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-lg">👤</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{member.member.name}</h4>
                                            <p className="text-sm text-gray-600">@{member.member.username}</p>
                                            <p className="text-xs text-gray-500">{member.member.email}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">Level {member.member.level}</span>
                                                <span className="text-xs text-gray-500">•</span>
                                                <span className="text-xs text-gray-500">{member.member.xp} XP</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {member.is_creator && (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Creator</span>
                                            )}
                                            <div 
                                                className="w-4 h-4 rounded-full border-2 border-gray-300"
                                                style={{ backgroundColor: member.member.card_theme }}
                                                title="Card Theme"
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
