import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";

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
  probabilityOnly: z
    .boolean()
    .default(true)
    .describe(
      "If true, return precipitation probability only; if false, include intensity estimates."
    ),
  aggregation: z
    .enum(["hourly", "daily", "none"])
    .default("hourly")
    .describe(
      "Aggregation level for results. 'none' returns raw series if available."
    ),
};

export const metadata: ToolMetadata = {
  name: "get_rain_forecast",
  description: "Get rain forecast for a given location and time window.",
  annotations: {
    title: "Get Rain Forecast",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getRainForecast(
  _args: InferSchema<typeof schema>
) {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: "get_rain_forecast is not implemented yet.",
      },
    ],
  } as const;
}
