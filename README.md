# Remote Weather MCP Server

An MCP (Model Context Protocol) server that provides weather forecasting tools. This project was created with [create-xmcp-app](https://github.com/basementstudio/xmcp).

## Supported Tools

This MCP server provides the following tools:

### `get_temperature_forecast`
- **Description**: Get hourly temperature forecast for a location between start and end dates using Open-Meteo API
- **Parameters**:
  - `location`: Location to forecast for (accepts city name, "City, Country", or coordinates "lat,lon")
  - `startDate`: Start date (YYYY-MM-DD), interpreted as 00:00:00 UTC
  - `endDate`: End date (YYYY-MM-DD), interpreted as 23:59:59 UTC
- **Returns**: JSON object with hourly temperature data in Celsius

### `get_rain_forecast`
- **Description**: Get rain forecast for a given location and time window
- **Note**: This tool is currently not implemented and will always return an error
- **Parameters**:
  - `location`: Location to forecast for (accepts city name, "City, Country", or coordinates "lat,lon")
  - `startDate`: Start date (YYYY-MM-DD), interpreted as 00:00:00 UTC
  - `endDate`: End date (YYYY-MM-DD), interpreted as 23:59:59 UTC
  - `probabilityOnly`: If true, return precipitation probability only (default: true)
  - `aggregation`: Aggregation level ("hourly", "daily", "none") (default: "hourly")

## Development

### Prerequisites
- Node.js >= 20.0.0
- npm, yarn, or pnpm

### Setup
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

This will start the MCP server in development mode with hot reloading.

## Production Build (Container Only)

### Build the Application
```bash
npm run build
```

This compiles your TypeScript code and outputs it to the `dist` directory.

### Build Docker Image
```bash
docker build -t remote-weather-mcp .
```

### Run Container Locally
```bash
docker run -p 3000:3000 remote-weather-mcp
```

The server will be available at `http://localhost:3000`.

## Deploy to Google Cloud Run

### Prerequisites
- Google Cloud SDK installed and configured
- A Google Cloud project
- Docker

### Steps

1. **Build and push the Docker image to Google Container Registry (GCR)**:
```bash
# Build the image
docker build -t gcr.io/YOUR_PROJECT_ID/remote-weather-mcp .

# Push to GCR
docker push gcr.io/YOUR_PROJECT_ID/remote-weather-mcp
```

2. **Deploy to Cloud Run**:
```bash
gcloud run deploy remote-weather-mcp \
  --image gcr.io/YOUR_PROJECT_ID/remote-weather-mcp \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1
```

3. **Get the service URL**:
```bash
gcloud run services describe remote-weather-mcp \
  --region us-central1 \
  --format "value(status.url)"
```

### Configuration Options

You can customize the deployment with additional flags:
- `--concurrency`: Maximum number of requests per container instance (default: 80)
- `--max-instances`: Maximum number of container instances (default: 100)
- `--timeout`: Maximum request execution time (default: 300 seconds)
- `--env-vars`: Set environment variables

Example with environment variables:
```bash
gcloud run deploy remote-weather-mcp \
  --image gcr.io/YOUR_PROJECT_ID/remote-weather-mcp \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --env-vars NODE_ENV=production
```

## Learn More

- [MCP Documentation](https://modelcontextprotocol.io/)
- [xmcp Documentation](https://xmcp.dev/docs)
- [Open-Meteo API](https://open-meteo.com/en/docs)
