class LivadaAPIClient {
    constructor(apiUrl) {
        // Use the provided URL or fall back to /api
        this.apiBaseUrl = apiUrl || '/api';
        
        // If it's a full URL, use it directly; otherwise treat as path
        if (this.apiBaseUrl.startsWith('http')) {
            // For full URLs, we'll use them directly
            this.useFullUrl = true;
            // Extract WebSocket URL from the API base URL
            const url = new URL(this.apiBaseUrl);
            const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
            this.wsUrl = `${wsProtocol}//${url.host}`;
        } else {
            // For paths, we'll prepend them
            this.useFullUrl = false;
            // Use environment variable for WebSocket URL if available
            this.wsUrl = process.env.REACT_APP_PI_WS_URL || 'ws://localhost:8765';
        }
        
        console.log('[LivadaAPIClient] Initialized with apiBaseUrl:', this.apiBaseUrl);
        console.log('[LivadaAPIClient] WebSocket URL:', this.wsUrl);
    }

    async _fetch(endpoint, options = {}) {
        try {
            let url;
            if (this.useFullUrl) {
                // For full URLs, append endpoint to base
                url = `${this.apiBaseUrl}${endpoint}`;
            } else {
                // For relative paths
                if (!endpoint.startsWith('/')) {
                    endpoint = '/' + endpoint;
                }
                url = `${this.apiBaseUrl}${endpoint}`;
            }
            
            console.log(`[LivadaAPIClient] Fetching from: ${url}`);
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`[LivadaAPIClient] Fetch error for ${endpoint}:`, error);
            throw error;
        }
    }

    getNodes() {
        return this._fetch('/nodes');
    }

    getLiveTelemetry() {
        return this._fetch('/telemetry/live');
    }

    async getHistoryTelemetry(startDate, endDate) {
        // Use the correct historical telemetry endpoint
        let endpoint = '/telemetry/history';
        const params = new URLSearchParams();
        if (startDate) {
            params.append('start_date', startDate.toISOString().split('T')[0]);
        }
        if (endDate) {
            params.append('end_date', endDate.toISOString().split('T')[0]);
        }
        if (params.toString()) {
            endpoint += `?${params.toString()}`;
        }
        return this._fetch(endpoint);
    }

    // --- WebSocket Connection Management ---

    connect(onTelemetryUpdate) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            console.log('[LivadaAPIClient] WebSocket already connected.');
            return;
        }

        this.shouldReconnect = true;
        if (onTelemetryUpdate) {
            this.onTelemetryUpdate = onTelemetryUpdate;
        }

        this.websocket = new WebSocket(this.wsUrl);

        this.websocket.onopen = () => {
            console.log('[LivadaAPIClient] WebSocket connection established.');
        };

        this.websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.onTelemetryUpdate(data);
            } catch (error) {
                console.error('[LivadaAPIClient] Error parsing WebSocket message:', error);
            }
        };

        this.websocket.onerror = (error) => {
            console.error('[LivadaAPIClient] WebSocket error:', error);
        };

        this.websocket.onclose = () => {
            console.log('[LivadaAPIClient] WebSocket connection closed.');
            if (this.shouldReconnect) {
                console.log('[LivadaAPIClient] Reconnecting in 5 seconds...');
                setTimeout(() => this.connect(), 5000);
            }
        };
    }

    disconnect() {
        this.shouldReconnect = false;
        if (this.websocket) {
            this.websocket.close();
        }
    }
}

export default LivadaAPIClient;
