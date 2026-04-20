import { NextResponse } from 'next/server';
import { getApiUrl, getApiHeaders } from '@/utils/envConfig';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const image1_object = formData.get('image1_object');
        const image2_model = formData.get('image2_model');
        const prompt = formData.get('prompt');
        const model = formData.get('model');
        const duration_seconds = formData.get('duration_seconds');

        if (!image1_object) {
            return NextResponse.json(
                { error: 'image1_object is required for video generation' },
                { status: 400 }
            );
        }

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required for video generation' },
                { status: 400 }
            );
        }

        const thirdPartyFormData = new FormData();

        thirdPartyFormData.append('image1_object', image1_object);

        if (image2_model) {
            thirdPartyFormData.append('image2_model', image2_model);
        }

        thirdPartyFormData.append('prompt', String(prompt));

        if (model) {
            thirdPartyFormData.append('model', String(model));
        }

        if (duration_seconds) {
            thirdPartyFormData.append('duration_seconds', String(duration_seconds));
        }
        console.log("getApiUrl('/generate-video')", getApiUrl('/generate-video'));
        const authHeader = request.headers.get('authorization');

        // Collect session headers to forward
        const sessionHeaders = {
            Yearcode: request.headers.get('yearcode'),
            Version: request.headers.get('version'),
            sv: request.headers.get('sv'),
            sp: request.headers.get('sp'),
            ukey: request.headers.get('ukey'),
        };

        const response = await fetch(getApiUrl('/generate-video'), {
            method: 'POST',
            body: thirdPartyFormData,
            headers: getApiHeaders(authHeader, sessionHeaders),
        });

        console.log('response', response);
        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Failed to generate video with Gemini', details: errorText },
                { status: response.status }
            );
        }

        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            const result = await response.json();
            return NextResponse.json(result);
        }

        const responseBuffer = await response.arrayBuffer();
        return new NextResponse(responseBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType || 'video/mp4',
                'Content-Length': responseBuffer.byteLength.toString(),
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}