import type { AstroIntegration } from "astro";

const integration = (): AstroIntegration => {
  return {
    name: "@urami/astro",
    hooks: {
      "astro:config:setup": ({ injectRoute }) => {
        injectRoute({
          pattern: "/_urami",
          entryPoint: "@urami/astro/serverHandler",
        });
      },
    },
  };
};

export default integration;
