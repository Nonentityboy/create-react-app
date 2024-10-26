const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000'; // 使用环境变量或本地默认地址

export default async function handler(req, res) {
    try {
        const response = await fetch(`${apiUrl}${req.url}`, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                ...req.headers,
            },
            body: req.body,
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error in proxy function:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
