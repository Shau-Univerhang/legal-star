export async function POST(request) {
  try {
    const { message, conversationId, stream } = await request.json();

    console.log('--- AI Chat Request Received ---');
    console.log('Message:', message);
    console.log('Stream:', stream);

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const cozeUrl = (process.env.COZE_API_BASE_URL || 'https://api.coze.cn') + '/v3/chat';
    const cozeToken = process.env.COZE_API_TOKEN;
    const botId = process.env.COZE_BOT_ID;

    console.log('Coze URL:', cozeUrl);
    console.log('Bot ID:', botId);
    console.log('Token exists:', !!cozeToken);

    if (!cozeToken || !botId) {
      console.error('Coze configuration missing');
      return Response.json({ error: 'Server configuration error: Missing Coze credentials' }, { status: 500 });
    }

    const body = {
      bot_id: botId,
      user_id: "user_" + Date.now(),
      additional_messages: [
        {
          role: "user",
          content: message,
          content_type: "text",
        },
      ],
      stream: !!stream
    };

    if (conversationId) {
      body.conversation_id = conversationId;
    }

    console.log(`Sending request to Coze...`);

    const response = await fetch(cozeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cozeToken,
      },
      body: JSON.stringify(body),
    });

    console.log('Coze Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Coze API error (${response.status}):`, errorText);
      return Response.json({ error: `Coze API error: ${response.status}`, details: errorText }, { status: response.status });
    }

    // Handle streaming response
    if (stream) {
      console.log('Streaming response back to client...');
      // Pass through the stream from Coze
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Handle normal JSON response
    const data = await response.json();
    console.log('Coze JSON Response:', JSON.stringify(data).substring(0, 200) + '...');
    return Response.json(data);

  } catch (err) {
    console.error('AI chat API error:', err);
    return Response.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
