const apiUrl = process.env.REACT_APP_API_URL || '';

/**
 * 发送 GET 请求
 * @param {string} endpoint - API 的子路径
 * @param {object} [options] - 其他 fetch 选项
 * @returns {Promise} 返回响应的 JSON 数据
 */
export const getRequest = async (endpoint, options = {}) => {
    // console.log({endpoint, options, apiUrl})
    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        // console.log({response})
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * 发送 POST 请求
 * @param {string} endpoint - API 的子路径
 * @param {object} data - 请求的 JSON 数据
 * @param {object} [options] - 其他 fetch 选项
 * @returns {Promise} 返回响应的 JSON 数据
 */
export const postRequest = async (endpoint, data, options = {}) => {
    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: JSON.stringify(data),
            ...options,
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
