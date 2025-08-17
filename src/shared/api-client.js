class LivadaAPIClient {
    constructor(apiBaseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : '/.netlify/functions/api-proxy', wsUrl) {
        this.apiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
        this.wsUrl = wsUrl;
        this.websocket = null;
        this.onTelemetryUpdate = () => {}; // Callback for real-time updates
        this.shouldReconnect = false;
    }

    // --- REST API Methods ---

    async _fetch(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, options);
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

    getHistoryTelemetry(startDate, endDate) {
        let endpoint = '/telemetry/history';
        const params = new URLSearchParams();
        if (startDate) {
            params.append('start_date', startDate.toISOString());
        }
        if (endDate) {
            params.append('end_date', endDate.toISOString());
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
