export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(200).end();
        return;
    }

    try {
        const targetUrl = `${apiUrl}${req.url.replace('/api/proxy', '')}`;
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                ...req.headers,
            },
            body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error in proxy function:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
