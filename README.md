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

The server will be available at `http://localhost:3000/mcp`.

## Deployment

You can deploy the MCP Server as Remote MCP Server to Google Cloud Run to make it available easily available to any client. 

To deploy the server, run the following command from your terminal, replacing `[PROJECT-ID]` and `[REGION]` with your Google Cloud project ID and desired region:

```bash
# Set your project ID and region
export PROJECT_ID=remote-mcp-test-462811
export REGION=europe-west1
export SERVICE_NAME=remote-weather-mcp-server

# Authenticate with Google Cloud
gcloud auth login
gcloud config set project $PROJECT_ID

# Enable required services
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

# Deploy the service
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --port 3000 \
  --allow-unauthenticated
```

The command will build the Docker image, push it to Google Artifact Registry, and deploy it to Cloud Run. After the deployment is complete, you will get a URL for your service. We will allow unauthenticated access to the service this means that anyone with the URL can send requests to the server. If you want to secure the service you can follow the instructions in the [Cloud Run documentation](https://cloud.google.com/run/docs/authenticating/service-to-service).

**cleanup**

```bash
SERVICE_NAME=remote-weather-mcp-server
REGION=europe-west1
gcloud run services delete $SERVICE_NAME --region $REGION
```

## Usage Examples

Add to your `mcpServers` configuration:

```json
{
  "mcpServers": {
    "weather-mcp": {
      "url": "https://remote-mcp-test.com/mcp/", // replace with your remote mcp server url
    }
  }
}
```

## Learn More

- [MCP Documentation](https://modelcontextprotocol.io/)
- [xmcp Documentation](https://xmcp.dev/docs)
- [Open-Meteo API](https://open-meteo.com/en/docs)
