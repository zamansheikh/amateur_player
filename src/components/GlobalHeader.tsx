'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';

interface Sponsor {
    brand_id: number;
    brandType: string;
    name: string;
    formal_name: string;
    logo_url: string;
}

export default function GlobalHeader() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                setLoading(true);
                // Fetch brands from the API
                const response = await fetch('https://test.bowlersnetwork.com/api/brands');
                const data = await response.json();
                
                console.log('API Response:', data); // Debug log
                
                // Handle different response structures
                let brandData = [];
                
                // Check if response has the expected structure from the logs
                if (data.Shoes && Array.isArray(data.Shoes)) {
                    // Combine all brand types from the response
                    brandData = [
                        // ...(data.Shoes || []),
                        // ...(data.Apparels || []),
                        // ...(data.Balls || []),
                        // ...(data.Accessories || []),
                        ...(data['Business Sponsors'] || [])
                    ];
                } else if (data.data && Array.isArray(data.data)) {
                    brandData = data.data;
                } else if (data.brands && Array.isArray(data.brands)) {
                    brandData = data.brands;
                } else if (Array.isArray(data)) {
                    brandData = data;
                } else {
                    console.error('Unexpected API response structure:', data);
                    brandData = [];
                }
                
                console.log('Processed brandData:', brandData); // Debug log
                
                // Ensure brandData is an array and slice it
                if (Array.isArray(brandData)) {
                    // const sponsorData = brandData.slice(0, 10);
                    const sponsorData = brandData;
                    console.log('Setting sponsors:', sponsorData); // Debug log
                    setSponsors(sponsorData); // Show max 8 sponsors
                } else {
                    console.error('brandData is not an array:', brandData);
                    setSponsors([]);
                }
            } catch (err) {
                console.error('Error fetching sponsors:', err);
                setSponsors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSponsors();
    }, []);

    console.log('GlobalHeader render - loading:', loading, 'sponsors:', sponsors); // Debug log

    if (loading) {
        return (
            <div className="bg-white border-b border-gray-200 py-3">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-center">
                        <div className="animate-pulse flex space-x-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Always show the header, even if no sponsors
    return (
        <div className="bg-white border-b border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-center">
                    <div className="text-xs text-gray-500 mr-6">Business Sponsors</div>
                    <div className="flex items-center justify-center space-x-3">
                        {sponsors.length > 0 ? (
                            sponsors.map((sponsor, index) => (
                                <div
                                    key={sponsor.brand_id || index}
                                    className="flex items-center justify-center bg-gray-50 rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
                                    title={sponsor.formal_name}
                                >
                                    <Image
                                        src={sponsor.logo_url}
                                        alt={sponsor.formal_name}
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-gray-400">No sponsors available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
