export default function ReferralsPage() {
    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Referrals</h1>
                <p className="text-gray-600 mt-2">
                    Invite friends and earn rewards through our referral program.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎁</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Referral Program</h2>
                <p className="text-gray-600 mb-6">
                    The referral system is currently under development. Invite friends and earn rewards soon!
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Coming Soon
                </button>
            </div>
        </div>
    );
}
