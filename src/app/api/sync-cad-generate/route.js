import { NextResponse } from 'next/server';
import { getApiUrl, getApiHeaders } from '@/utils/envConfig';

export async function POST(request) {
    try {
        const formData = await request.formData();
        
        // Extract all expected fields from the incoming request
        const file = formData.get('file');
        const image_enhancement = formData.get('image_enhancement');
        const multi_view = formData.get('multi_view');
        const enable_pbr = formData.get('enable_pbr');
        const uKey = formData.get('uKey');
        const uniqueNo = formData.get('uniqueNo');
        const generatedFolderName = formData.get('generatedFolderName');
        const referenceFolderName = formData.get('referenceFolderName');
        const f = formData.get('f');

        if (!file) {
            return NextResponse.json(
                { error: 'File is required for CAD generation' },
                { status: 400 }
            );
        }

        // Reconstruct FormData for the third-party API
        const thirdPartyFormData = new FormData();
        thirdPartyFormData.append('file', file);
        thirdPartyFormData.append('image_enhancement', image_enhancement || 'true');
        thirdPartyFormData.append('multi_view', multi_view || 'true');
        thirdPartyFormData.append('enable_pbr', enable_pbr || 'true');
        thirdPartyFormData.append('uKey', uKey || '');
        thirdPartyFormData.append('uniqueNo', uniqueNo || '');
        thirdPartyFormData.append('generatedFolderName', generatedFolderName || 'Generated');
        thirdPartyFormData.append('referenceFolderName', referenceFolderName || 'Reference');
        thirdPartyFormData.append('f', f || 'AI Sync CAD Generate');

        const authHeader = request.headers.get('authorization');

        // Forward standard custom headers
        const sessionHeaders = {
            Yearcode: request.headers.get('yearcode'),
            Version: request.headers.get('version'),
            sv: request.headers.get('sv'),
            sp: request.headers.get('sp'),
            ukey: request.headers.get('ukey'),
        };

        const response = await fetch(getApiUrl('/sync-cad-genrate'), {
            method: 'POST',
            body: thirdPartyFormData,
            headers: getApiHeaders(authHeader, sessionHeaders),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Failed to generate CAD with backend service', details: errorText },
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
        console.error('CAD Proxy Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
