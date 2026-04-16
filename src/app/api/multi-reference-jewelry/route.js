import { NextResponse } from 'next/server';
import { getApiUrl, getApiHeaders } from '@/utils/envConfig';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const model_image = formData.get('model_image');
        const ring_images = formData.get('ring_images');
        const necklace_images = formData.get('necklace_images');
        const bangle_images = formData.get('bangle_images');
        const earing_images = formData.get('earing_images');
        const prompt = formData.get('prompt');
        const max_jewelry_references = formData.get('max_jewelry_references');
        const gemini_model = formData.get('gemini_model');

        if (!model_image) {
            return NextResponse.json(
                { error: 'model_image is required for jewelry generation' },
                { status: 400 }
            );
        }

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required for jewelry generation' },
                { status: 400 }
            );
        }

        const thirdPartyFormData = new FormData();

        thirdPartyFormData.append('model_image', model_image);

        if (ring_images) {
            thirdPartyFormData.append('ring_images', ring_images);
        }

        if (necklace_images) {
            thirdPartyFormData.append('necklace_images', necklace_images);
        }

        if (bangle_images) {
            thirdPartyFormData.append('bangle_images', bangle_images);
        }

        if (earing_images) {
            thirdPartyFormData.append('earing_images', earing_images);
        }

        thirdPartyFormData.append('prompt', String(prompt));

        if (max_jewelry_references) {
            thirdPartyFormData.append('max_jewelry_references', String(max_jewelry_references));
        }

        if (gemini_model) {
            thirdPartyFormData.append('gemini_model', String(gemini_model));
        }

        console.log("getApiUrl('/multi-reference-jewelry')", getApiUrl('/multi-reference-jewelry'));
        const authHeader = request.headers.get('authorization');
        const response = await fetch(getApiUrl('/multi-reference-jewelry'), {
            method: 'POST',
            body: thirdPartyFormData,
            headers: getApiHeaders(authHeader),
        });

        console.log('response', response);
        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Failed to generate jewelry image with Gemini', details: errorText },
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
                'Content-Type': contentType || 'image/jpeg',
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