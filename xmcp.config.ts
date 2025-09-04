import { type XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  http: {
    host: "0.0.0.0",
    port: 3000,
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
