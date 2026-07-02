import type { StorybookConfig } from "@storybook/react";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  framework: {
    name: "@storybook/react",
    options: {}
  },
  docs: {
    autodocs: true
  }
};

export default config;
