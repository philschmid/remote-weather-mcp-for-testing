import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { resolveLocationToCoordinates } from "../utils/geocoding";
import { buildEndDate, buildStartDate } from "../utils/date";

export const schema = {
  location: z
    .string()
    .describe(
      "Location to forecast for. Accepts city name, 'City, Country', or coordinates 'lat,lon'"
    ),
  startDate: z
    .string()
    .describe("Start date (YYYY-MM-DD). Interpreted as 00:00:00 UTC."),
  endDate: z
    .string()
    .describe("End date (YYYY-MM-DD). Interpreted as 23:59:59 UTC."),
};

export const metadata: ToolMetadata = {
  name: "get_temperature_forecast",
  description:
    "Get hourly temperature forecast for a location between start and end dates using Open-Meteo.",
  annotations: {
    title: "Get Temperature Forecast",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export default async function getTemperatureForecast(
  _args: InferSchema<typeof schema>
) {
  const { location, startDate, endDate } = _args;

  try {
    const { latitude, longitude } = await resolveLocationToCoordinates(
      location
    );

    // Convert to ISO string
    const startDateString = buildStartDate(startDate);
    const endDateString = buildEndDate(endDate);

    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      timezone: "UTC",
      start_date: String(startDateString),
      end_date: String(endDateString),
    });
    params.set("hourly", "temperature_2m");

    const apiUrl = `${BASE_URL}?${params.toString()}`;
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`Forecast failed with status ${res.status}`);
    }

    const data: any = await res.json();
    if (!data.hourly || !data.hourly.time || !data.hourly.temperature_2m) {
      throw new Error("Weather data format incorrect");
    }
    const times: string[] = data.hourly.time;
    const temps: number[] = data.hourly.temperature_2m;

    // Zip times and temps
    const result = Object.fromEntries(
      times.map((time, i) => [time, temps[i] + "°C"])
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    } as const;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error fetching forecast";
    return {
      isError: true,
      content: [{ type: "text", text: message }],
    } as const;
  }
}
