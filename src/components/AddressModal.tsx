'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search, Loader, MapPin, Map as MapIcon } from 'lucide-react';
import { useMapboxGeocoding } from '@/lib/useMapboxGeocoding';
import { GeocodingResult } from '@/lib/mapboxGeocodingService';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: {
        address: string;
        zipcode: string;
        latitude: string;
        longitude: string;
    }) => void;
    initialAddress?: string;
    initialZipcode?: string;
    title?: string;
}

export default function AddressModal({
    isOpen,
    onClose,
    onSave,
    initialAddress = '',
    initialZipcode = '',
    title = 'Update Address'
}: AddressModalProps) {
    const [searchType, setSearchType] = useState<'address' | 'zipcode'>('zipcode');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState({
        address: initialAddress,
        zipcode: initialZipcode,
        latitude: '',
        longitude: ''
    });
    const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default: NYC
    const [markerPosition, setMarkerPosition] = useState({ lat: 40.7128, lng: -74.0060 });

    const { geocodeMultiple, results: addressSuggestions, isLoading: isGeocodingLoading } = useMapboxGeocoding();
    const searchDebounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setShowSuggestions(false);
            setShowMapPicker(false);
            setSelectedAddress({
                address: initialAddress,
                zipcode: initialZipcode,
                latitude: '',
                longitude: ''
            });
        }
    }, [isOpen, initialAddress, initialZipcode]);

    // Load Mapbox script when map picker is shown
    useEffect(() => {
        if (showMapPicker && !(window as any).mapboxgl) {
            const script = document.createElement('script');
            script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
            script.async = true;
            document.head.appendChild(script);

            const link = document.createElement('link');
            link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
            link.rel = 'stylesheet';
            document.head.appendChild(link);

            script.onload = () => initializeMap();
        } else if (showMapPicker && (window as any).mapboxgl) {
            initializeMap();
        }
    }, [showMapPicker]);

    const initializeMap = () => {
        if (!(window as any).mapboxgl || mapRef.current) return;

        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!mapboxToken) return;

        (window as any).mapboxgl.accessToken = mapboxToken;
        
        const map = new (window as any).mapboxgl.Map({
            container: 'address-map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [mapCenter.lng, mapCenter.lat],
            zoom: 12
        });

        // Add marker
        const marker = new (window as any).mapboxgl.Marker({
            draggable: true,
            color: '#8BC342'
        })
            .setLngLat([mapCenter.lng, mapCenter.lat])
            .addTo(map);

        // Update position when marker is dragged
        marker.on('dragend', async () => {
            const lngLat = marker.getLngLat();
            setMarkerPosition({ lat: lngLat.lat, lng: lngLat.lng });
            
            // Reverse geocode to get address
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxToken}`
                );
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                    const feature = data.features[0];
                    const zipcode = feature.context?.find((c: any) => c.id.startsWith('postcode'))?.text || '';
                    
                    setSelectedAddress({
                        address: feature.place_name || '',
                        zipcode: zipcode,
                        latitude: lngLat.lat.toString(),
                        longitude: lngLat.lng.toString()
                    });
                }
            } catch (error) {
                console.error('Reverse geocoding error:', error);
            }
        });

        // Click on map to move marker
        map.on('click', async (e: any) => {
            marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
            setMarkerPosition({ lat: e.lngLat.lat, lng: e.lngLat.lng });
            
            // Reverse geocode
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxToken}`
                );
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                    const feature = data.features[0];
                    const zipcode = feature.context?.find((c: any) => c.id.startsWith('postcode'))?.text || '';
                    
                    setSelectedAddress({
                        address: feature.place_name || '',
                        zipcode: zipcode,
                        latitude: e.lngLat.lat.toString(),
                        longitude: e.lngLat.lng.toString()
                    });
                }
            } catch (error) {
                console.error('Reverse geocoding error:', error);
            }
        });

        mapRef.current = map;
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (searchDebounceTimer.current) {
            clearTimeout(searchDebounceTimer.current);
        }

        if (query.trim().length < 2) {
            setShowSuggestions(false);
            return;
        }

        searchDebounceTimer.current = setTimeout(() => {
            geocodeMultiple(query);
            setShowSuggestions(true);
        }, 300);
    };

    const handleSelectSuggestion = (result: GeocodingResult) => {
        setSelectedAddress({
            address: result.address || '',
            zipcode: result.zipcode || '',
            latitude: result.latitude?.toString() || '',
            longitude: result.longitude?.toString() || ''
        });
        setSearchQuery(result.address || '');
        setShowSuggestions(false);
    };

    const handleOpenMapPicker = () => {
        setShowMapPicker(true);
        setShowSuggestions(false);
        
        // If we have coordinates from selected address, use those
        if (selectedAddress.latitude && selectedAddress.longitude) {
            const lat = parseFloat(selectedAddress.latitude);
            const lng = parseFloat(selectedAddress.longitude);
            setMapCenter({ lat, lng });
            setMarkerPosition({ lat, lng });
        }
    };

    const handleSave = () => {
        if (!selectedAddress.address) {
            alert('Please select or enter an address');
            return;
        }
        onSave(selectedAddress);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {!showMapPicker ? (
                        <>
                            {/* Search Type Toggle */}
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                                {/* <button
                                    onClick={() => setSearchType('address')}
                                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                                        searchType === 'address'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Search by Address
                                </button> */}
                                <button
                                    onClick={() => setSearchType('zipcode')}
                                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                                        searchType === 'zipcode'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Search by Zip Code
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="relative">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder={
                                            searchType === 'address'
                                                ? 'Enter address (e.g., "123 Main St, New York")'
                                                : 'Enter zip code (e.g., "10001")'
                                        }
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    {isGeocodingLoading && (
                                        <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600 animate-spin" />
                                    )}
                                </div>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && addressSuggestions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {addressSuggestions.map((result, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSelectSuggestion(result)}
                                                className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b last:border-b-0 transition-colors"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900">{result.address}</div>
                                                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                            {result.zipcode && (
                                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                                                    ZIP: {result.zipcode}
                                                                </span>
                                                            )}
                                                            {result.city && (
                                                                <span className="text-xs">{result.city}</span>
                                                            )}
                                                            {result.state && (
                                                                <span className="text-xs">{result.state}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* No Results */}
                                {showSuggestions && addressSuggestions.length === 0 && !isGeocodingLoading && searchQuery.trim().length >= 2 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                                        <div className="text-center space-y-3">
                                            <p className="text-sm text-gray-500">
                                                No addresses found for "{searchQuery}"
                                            </p>
                                            <button
                                                onClick={handleOpenMapPicker}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                                            >
                                                <MapIcon className="w-4 h-4" />
                                                Pick from Map
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Selected Address Display */}
                            {selectedAddress.address && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Selected Address:</p>
                                            <p className="text-gray-700 mt-1">{selectedAddress.address}</p>
                                            {selectedAddress.zipcode && (
                                                <p className="text-sm text-gray-600 mt-1">Zip Code: {selectedAddress.zipcode}</p>
                                            )}
                                            {selectedAddress.latitude && selectedAddress.longitude && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Coordinates: {parseFloat(selectedAddress.latitude).toFixed(6)}, {parseFloat(selectedAddress.longitude).toFixed(6)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Map Picker Button */}
                            {!showSuggestions && (
                                <div className="pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleOpenMapPicker}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-gray-600 hover:text-green-700"
                                    >
                                        <MapIcon className="w-5 h-5" />
                                        <span className="font-medium">Or pick location from map</span>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Map Picker */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Click or drag the marker to select your location
                                    </p>
                                    <button
                                        onClick={() => setShowMapPicker(false)}
                                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                                    >
                                        Back to Search
                                    </button>
                                </div>
                                
                                <div
                                    id="address-map"
                                    className="w-full h-96 rounded-lg border border-gray-300"
                                />

                                {/* Selected Address from Map */}
                                {selectedAddress.address && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">Selected Location:</p>
                                                <p className="text-gray-700 mt-1">{selectedAddress.address}</p>
                                                {selectedAddress.zipcode && (
                                                    <p className="text-sm text-gray-600 mt-1">Zip Code: {selectedAddress.zipcode}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Coordinates: {parseFloat(selectedAddress.latitude).toFixed(6)}, {parseFloat(selectedAddress.longitude).toFixed(6)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!selectedAddress.address}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Save Address
                    </button>
                </div>
            </div>
        </div>
    );
}
