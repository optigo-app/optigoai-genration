import { NextResponse } from 'next/server';
import { getApiUrl, getApiHeaders } from '../../../../utils/envConfig';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file');
    const prompt = formData.get('prompt');
    const model = formData.get('model');
    const durationSeconds = formData.get('duration_seconds');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'At least one file is required for video generation' },
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

    files.forEach((file) => {
      if (file) {
        thirdPartyFormData.append('file', file);
      }
    });

    thirdPartyFormData.append('prompt', String(prompt));

    if (model) {
      thirdPartyFormData.append('model', String(model));
    }

    if (durationSeconds) {
      thirdPartyFormData.append('duration_seconds', String(durationSeconds));
    }

    const authHeader = request.headers.get('authorization');
    const response = await fetch(getApiUrl('/gemini/generate-video'), {
      method: 'POST',
      body: thirdPartyFormData,
      headers: getApiHeaders(authHeader),
    });

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
