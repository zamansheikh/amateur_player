'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Search, MessageCircle, Upload } from 'lucide-react';
import { api } from '@/lib/api';

interface Team {
    team_id: number;
    name: string;
    logo_url: string;
    created_by: {
        user_id: number;
        username: string;
        name: string;
        first_name: string;
        last_name: string;
        profile_picture_url: string;
        intro_video_url: string;
        xp: number;
        email: string;
        level: number;
        card_theme: string;
    };
    created_at: string;
    member_count?: number;
}

interface Member {
    user_id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string;
    intro_video_url: string;
    xp: number;
    email: string;
    level: number;
    card_theme: string;
}

interface TeamMember {
    member_id: number;
    member: Member;
    is_creator: boolean;
}

interface Invitation {
    invitation_id: number;
    invited_user: Member;
    team: Team;
}

interface InvitationsResponse {
    received: Invitation[];
    sent: Invitation[];
}

export default function TeamsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSelectingMembers, setIsSelectingMembers] = useState(false);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
    const [invitations, setInvitations] = useState<InvitationsResponse>({ received: [], sent: [] });
    const [teamMembers, setTeamMembers] = useState<{ [key: number]: TeamMember[] }>({});

    // Fetch teams data
    const fetchTeams = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/user/teams');
            const teamsWithMembers = await Promise.all(
                response.data.my_teams.map(async (team: Team) => {
                    try {
                        const membersResponse = await api.get(`/api/user/teams/${team.team_id}/members`);
                        setTeamMembers(prev => ({
                            ...prev,
                            [team.team_id]: membersResponse.data.members
                        }));
                        return {
                            ...team,
                            member_count: membersResponse.data.member_count
                        };
                    } catch (error) {
                        console.error(`Error fetching members for team ${team.team_id}:`, error);
                        return { ...team, member_count: 0 };
                    }
                })
            );
            setTeams(teamsWithMembers);
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch available members
    const fetchMembers = async () => {
        try {
            const response = await api.get('/api/user/members');
            setAvailableMembers(response.data.members);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    // Fetch invitations
    const fetchInvitations = async () => {
        try {
            const response = await api.get('/api/user/teams/invitations');
            setInvitations(response.data);
        } catch (error) {
            console.error('Error fetching invitations:', error);
        }
    };

    useEffect(() => {
        fetchTeams();
        fetchMembers();
        fetchInvitations();
    }, []);

    const filteredMembers = availableMembers.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateTeam = async () => {
        if (!teamName.trim()) return;

        try {
            setCreating(true);
            const response = await api.post('/api/user/teams', {
                name: teamName
            });

            if (response.status === 200 || response.status === 201) {
                // Send invitations to selected members
                if (selectedMembers.length > 0) {
                    await Promise.all(
                        selectedMembers.map(userId =>
                            api.post('/api/user/teams/invite', {
                                team_id: response.data.team_id,
                                invited_user_id: userId
                            })
                        )
                    );
                }

                // Refresh teams list
                await fetchTeams();
                await fetchInvitations();

                // Reset form
                setIsCreateModalOpen(false);
                setTeamName('');
                setSelectedMembers([]);
                setIsSelectingMembers(false);
                setSearchQuery('');
            }
        } catch (error) {
            console.error('Error creating team:', error);
        } finally {
            setCreating(false);
        }
    };

    const handleMemberToggle = (userId: number) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectMemberClick = () => {
        setIsSelectingMembers(true);
    };

    const handleAcceptInvitation = async (invitationId: number) => {
        try {
            await api.post('/api/user/teams/invitations', {
                invitation_id: invitationId,
                is_accepted: true
            });
            await fetchTeams();
            await fetchInvitations();
        } catch (error) {
            console.error('Error accepting invitation:', error);
        }
    };

    const handleRejectInvitation = async (invitationId: number) => {
        try {
            await api.post('/api/user/teams/invitations', {
                invitation_id: invitationId,
                is_accepted: false
            });
            await fetchInvitations();
        } catch (error) {
            console.error('Error rejecting invitation:', error);
        }
    };

    const handleWithdrawInvitation = async (invitationId: number) => {
        try {
            await api.delete('/api/user/teams/invitations', {
                data: { invitation_id: invitationId }
            });
            await fetchInvitations();
        } catch (error) {
            console.error('Error withdrawing invitation:', error);
        }
    };

    const handleDeleteTeam = async (teamId: number) => {
        if (confirm('Are you sure you want to delete this team?')) {
            try {
                await api.delete(`/api/user/teams/${teamId}/delete`);
                await fetchTeams();
            } catch (error) {
                console.error('Error deleting team:', error);
            }
        }
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
                                placeholder="Search teams..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Invitation Management Section */}
            {(invitations.received.length > 0 || invitations.sent.length > 0) && (
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Invitation Management
                            </h2>
                            <p className="text-green-100 text-sm mt-1">
                                Manage your team invitations - received and sent
                            </p>
                        </div>

                        <div className="p-6">
                            {/* Received Invitations */}
                            {invitations.received.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <h3 className="text-md font-semibold text-gray-900">
                                            Pending Invitations ({invitations.received.length})
                                        </h3>
                                    </div>
                                    <div className="space-y-3">
                                        {invitations.received.map((invitation) => (
                                            <div key={invitation.invitation_id} className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 hover:bg-yellow-100 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-300">
                                                            {invitation.team.logo_url ? (
                                                                <img src={invitation.team.logo_url} alt={invitation.team.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                                                                    <span className="text-white text-lg font-bold">
                                                                        {invitation.team.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                <span className="text-yellow-700 font-semibold">{invitation.team.created_by.name}</span> invited you to join
                                                            </p>
                                                            <p className="text-lg font-bold text-gray-800">{invitation.team.name}</p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                <span>📅</span>
                                                                Invited on {new Date(invitation.team.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAcceptInvitation(invitation.invitation_id)}
                                                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                                                        >
                                                            <span>✓</span>
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectInvitation(invitation.invitation_id)}
                                                            className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                                                        >
                                                            <span>✕</span>
                                                            Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sent Invitations */}
                            {invitations.sent.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <h3 className="text-md font-semibold text-gray-900">
                                            Sent Invitations ({invitations.sent.length})
                                        </h3>
                                    </div>
                                    <div className="space-y-3">
                                        {invitations.sent.map((invitation) => (
                                            <div key={invitation.invitation_id} className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-300">
                                                            {invitation.invited_user.profile_picture_url ? (
                                                                <img src={invitation.invited_user.profile_picture_url} alt={invitation.invited_user.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                                                                    <span className="text-white text-lg font-bold">
                                                                        {invitation.invited_user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">You invited</p>
                                                            <p className="text-lg font-bold text-gray-800">{invitation.invited_user.name}</p>
                                                            <p className="text-sm text-blue-700 font-medium">
                                                                to join <span className="font-bold">{invitation.team.name}</span>
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                                                <p className="text-xs text-gray-500">Waiting for response</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <button
                                                            onClick={() => handleWithdrawInvitation(invitation.invitation_id)}
                                                            className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 mb-2"
                                                        >
                                                            <span>↶</span>
                                                            Withdraw
                                                        </button>
                                                        <p className="text-xs text-gray-400">
                                                            Level {invitation.invited_user.level} • {invitation.invited_user.xp} XP
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Invitations Message */}
                            {invitations.received.length === 0 && invitations.sent.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageCircle className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">No pending invitations</p>
                                    <p className="text-gray-400 text-sm">Create a team and start inviting members!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Teams Count and Create Button */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    {loading ? 'Loading...' : `${teams.length} Teams`}
                </h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create new Team
                </button>
            </div>

            {/* Teams List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {teams.map((team) => (
                        <div key={team.team_id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        {team.logo_url ? (
                                            <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500 text-lg">👥</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="text-blue-600">{team.member_count || 0} Members</span>
                                            <span>Created {team.created_at}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteTeam(team.team_id)}
                                    className="w-10 h-10 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors group"
                                >
                                    <span className="text-gray-600 group-hover:text-red-600 text-lg">🗑️</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sent Invitations */}
            {invitations.sent.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Sent Invitations</h2>
                    <div className="space-y-3">
                        {invitations.sent.map((invitation) => (
                            <div key={invitation.invitation_id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden">
                                            {invitation.invited_user.profile_picture_url ? (
                                                <img src={invitation.invited_user.profile_picture_url} alt={invitation.invited_user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-xs">👤</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-900">
                                                Invited <span className="font-semibold">{invitation.invited_user.name}</span> to{' '}
                                                <span className="font-semibold">{invitation.team.name}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">Pending response</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleWithdrawInvitation(invitation.invitation_id)}
                                        className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition-colors"
                                    >
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                                                key={member.user_id}
                                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
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
                                                    <span className="text-gray-900">{member.name}</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembers.includes(member.user_id)}
                                                    onChange={() => handleMemberToggle(member.user_id)}
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
                            disabled={!teamName.trim() || creating}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            {creating ? 'Creating...' : 'Create Team'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
