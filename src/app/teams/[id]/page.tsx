'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MessageCircle, Settings } from 'lucide-react';
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

export default function TeamDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const teamId = params.id as string;

    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (teamId) {
            fetchTeamDetails();
        }
    }, [teamId]);

    const handleTeamChat = () => {
        if (team?.team_chat_room_id) {
            router.push(`/messages?room=${team.team_chat_room_id}`);
        }
    };

    const handleManageTeam = () => {
        router.push(`/teams/${teamId}/manage`);
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
                                <div className="w-16 h-16 rounded-full overflow-hidden">
                                    {team.logo_url ? (
                                        <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                            <span className="text-white text-2xl font-bold">
                                                {team.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                                    <p className="text-gray-600">Team Information</p>
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
                                onClick={handleManageTeam}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                Manage Team
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Team Stats */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{team.members.member_count}</div>
                                    <div className="text-sm text-blue-800">Members</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">{team.team_id}</div>
                                    <div className="text-sm text-green-800">Team ID</div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 text-center col-span-2">
                                    <div className="text-lg font-bold text-purple-600">{team.created_at}</div>
                                    <div className="text-sm text-purple-800">Created Date</div>
                                </div>
                            </div>
                        </div>

                        {/* Team Creator */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Creator</h3>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
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
                                        <p className="font-semibold text-gray-900">{team.created_by.name}</p>
                                        <p className="text-sm text-gray-600">@{team.created_by.username}</p>
                                        <p className="text-xs text-gray-500">{team.created_by.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Members</h3>
                            <div className="space-y-4">
                                {team.members.members.map((member) => (
                                    <div key={member.member_id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
