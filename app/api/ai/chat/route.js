export async function POST(request) {
  try {
    const { message, conversationId, stream } = await request.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const cozeUrl = (process.env.COZE_API_BASE_URL || 'https://api.coze.cn') + '/v3/chat';
    const cozeToken = process.env.COZE_API_TOKEN;
    const botId = process.env.COZE_BOT_ID;

    if (!cozeToken || !botId) {
      return Response.json({ error: 'Server configuration error: Missing Coze credentials' }, { status: 500 });
    }

    // Definitive fix: Combine the working message structure with the agent scene parameter
    const body = {
      bot_id: botId,
      user_id: "user_" + Date.now(),
      // Use 'additional_messages' as it was the only structure that previously worked
      additional_messages: [
        {
          role: "user",
          content: message,
          content_type: "text",
        },
      ],
      // The 'scene' parameter is crucial to enable agent capabilities like plugins
      scene: "agent", 
      stream: !!stream
    };

    if (conversationId) {
      body.conversation_id = conversationId;
    }

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
      return Response.json({ error: `Coze API error: ${response.status}`, details: errorText }, { status: response.status });
    }

    if (stream) {
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      const data = await response.json();
      return Response.json(data);
    }

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
