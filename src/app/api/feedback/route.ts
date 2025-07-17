import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.title || !body.description || !body.type) {
            return NextResponse.json(
                { error: 'Title, description, and type are required' },
                { status: 400 }
            );
        }

        // Log the feedback for now (you can replace this with actual database storage)
        console.log('Feedback received:', {
            title: body.title,
            description: body.description,
            type: body.type,
            user_id: body.user_id,
            user_name: body.user_name,
            user_email: body.user_email,
            timestamp: new Date().toISOString()
        });

        // Here you would typically:
        // 1. Save to database
        // 2. Send email notification
        // 3. Create ticket in issue tracking system
        // 4. etc.

        // For now, we'll simulate a successful response
        // You can replace this with actual API call to your backend
        
        // Example: Forward to external API
        /*
        const response = await fetch('https://your-api-endpoint.com/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: body.title,
                description: body.description,
                type: body.type,
                user_id: body.user_id,
                user_name: body.user_name,
                user_email: body.user_email,
                timestamp: new Date().toISOString()
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit feedback');
        }

        const result = await response.json();
        */

        return NextResponse.json(
            { 
                message: 'Feedback submitted successfully',
                id: Date.now(), // Temporary ID
                status: 'received'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error processing feedback:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
