import { type XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  http: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 8080,
    cors: {
      origin: "*",
    },
  },
  paths: {
    tools: true,
    prompts: false,
  },
};

export default config;
