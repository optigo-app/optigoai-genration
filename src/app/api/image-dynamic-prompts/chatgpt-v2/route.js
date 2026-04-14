import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl, getApiHeaders } from '../../../../utils/envConfig';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const prompt = formData.get('prompt');

    if (!file) {
      return NextResponse.json(
        { error: 'File is required for ChatGPT v2 processing' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required for ChatGPT v2 processing' },
        { status: 400 }
      );
    }

    const thirdPartyFormData = new FormData();
    thirdPartyFormData.append('file', file);
    thirdPartyFormData.append('prompt', prompt);

    const authHeader = request.headers.get('authorization');
    const response = await fetch(getApiUrl('/chatgpt-v2/new'), {
      method: 'POST',
      body: thirdPartyFormData,
      headers: getApiHeaders(authHeader),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ChatGPT v2 API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to process image with ChatGPT v2', details: errorText },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      return NextResponse.json({
        status: 'success',
        processor: 'chatgpt-v2',
        prompt: prompt,
        ...result
      });
    } else {
      const imageBuffer = await response.arrayBuffer();
      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType || 'image/png',
          'Content-Length': imageBuffer.byteLength.toString(),
          'X-Processor': 'chatgpt-v2',
          'X-Prompt': encodeURIComponent(prompt),
        },
      });
    }

  } catch (error) {
    console.error('ChatGPT v2 processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
