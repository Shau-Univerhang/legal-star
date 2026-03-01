export async function POST(request) {
  try {
    const { message, conversationId, stream } = await request.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const cozeUrl = process.env.COZE_API_BASE_URL + '/v3/chat';
    const cozeToken = process.env.COZE_API_TOKEN;
    const botId = process.env.COZE_BOT_ID;

    if (!cozeToken || !botId) {
      console.error('Coze configuration missing');
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
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

    console.log(`Sending request to Coze: ${cozeUrl} (stream: ${!!stream})`);

    const response = await fetch(cozeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cozeToken,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Coze API error (${response.status}):`, errorText);
      return Response.json({ error: `Coze API error: ${response.status}` }, { status: response.status });
    }

    // Handle streaming response
    if (stream) {
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
    return Response.json(data);

  } catch (err) {
    console.error('AI chat API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
