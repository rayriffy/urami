import type { AstroIntegration } from "astro";
import type { Config } from "@urami/core";

const VIRTUAL_MODULE_ID = "virtual:@urami/astro/config";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

const integration = (config?: Partial<Config>): AstroIntegration => {
  return {
    name: "@urami/astro",
    hooks: {
      "astro:config:setup": ({ injectRoute, updateConfig }) => {
        injectRoute({
          pattern: "/_urami",
          entrypoint: "@urami/astro/serverHandler",
        } as any);

        updateConfig({
          vite: {
            plugins: [
              {
                name: "@urami/astro/config",
                resolveId(id: string) {
                  if (id === VIRTUAL_MODULE_ID) {
                    return RESOLVED_VIRTUAL_MODULE_ID;
                  }
                },
                load(id: string) {
                  if (id === RESOLVED_VIRTUAL_MODULE_ID) {
                    return `export default ${JSON.stringify(config ?? {})};`;
                  }
                },
              },
            ],
          },
        });
      },
    },
  };
};

export default integration;
