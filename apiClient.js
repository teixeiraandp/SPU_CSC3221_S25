// apiClient.js

// Define a class called ApiClient that wraps around the Fetch API.
// This class simplifies making HTTP requests (GET, POST, PUT, DELETE)
// and handles routes, query parameters, request bodies, and error handling.
class ApiClient {

    // Constructor: takes the base URL of the API (e.g., https://jsonplaceholder.typicode.com)
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    // Perform a GET request to a route, with optional query parameters
    async get(route, params = {}) {
        return this._request('GET', route, null, params);
    }

    // Perform a POST request to a route, with a JSON body and optional query parameters
    async post(route, body = {}, params = {}) {
        return this._request('POST', route, body, params);
    }

    // Perform a PUT request to a route, with a JSON body and optional query parameters
    async put(route, body = {}, params = {}) {
        return this._request('PUT', route, body, params);
    }

    // Perform a DELETE request to a route, with optional query parameters
    async delete(route, params = {}) {
        return this._request('DELETE', route, null, params);
    }

    // Perform a PATCH request to a route, with a JSON body and optional query parameters
    async patch(route, body = {}, params = {}) {
        return this._request('PATCH', route, body, params);
}
    // Private helper method: constructs a full URL with query parameters
    _buildURL(route, params) {
        const url = new URL(`${this.baseURL}${route}`);
        // Add each parameter as a query string (e.g., ?id=1&sort=name)
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        return url;
    }

    // Private helper method: performs the fetch request using the specified method, route, body, and parameters
    async _request(method, route, body = null, params = {}) {
        const url = this._buildURL(route, params); // Build the complete URL

        const options = {
            method, // HTTP method (GET, POST, etc.)
            headers: {
                'Content-Type': 'application/json' // Sending/receiving JSON
            }
        };

        // Attach body only for POST or PUT
        if (body) {
            options.body = JSON.stringify(body); // Convert JS object to JSON string
        }

        try {
            // Perform the fetch call
            const response = await fetch(url, options);

            // If the response is not successful, throw an error
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            // Parse and return the JSON response
            return await response.json();
        } catch (error) {
            // Log and rethrow the error so the calling code can handle it
            console.error(`Request failed: ${error}`);
            throw error;
        }
    }
}

// Export the ApiClient class as the default export so it can be imported in app.js
export default ApiClient;