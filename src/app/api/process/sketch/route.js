import { NextResponse } from 'next/server';
import { getApiUrl, getApiHeaders } from '../../../../utils/envConfig';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'File is required for Sketch processing' },
        { status: 400 }
      );
    }

    const thirdPartyFormData = new FormData();
    thirdPartyFormData.append('file', file);

    const authHeader = request.headers.get('authorization');
    const response = await fetch(getApiUrl('/sketch'), {
      method: 'POST',
      body: thirdPartyFormData,
      headers: getApiHeaders(authHeader),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to process image with Sketch', details: errorText },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      return NextResponse.json(result);
    }

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType || 'image/png',
        'Content-Length': imageBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
