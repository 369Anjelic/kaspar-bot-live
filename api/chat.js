// api/chat.js
// Vercel Serverless Function - API-Key VERSTECKT auf Server!

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages, systemPrompt } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
        console.error('ANTHROPIC_API_KEY not configured');
        return res.status(500).json({ error: 'API Key not configured - contact admin' });
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-opus-4-5-20251101',
                max_tokens: 500,
                system: systemPrompt,
                messages: messages
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Claude API error:', data);
            return res.status(response.status).json(data);
        }

        const messageText = data.content[0].text;

        return res.status(200).json({
            success: true,
            message: messageText
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            error: 'Failed to process request',
            details: error.message
        });
    }
}
