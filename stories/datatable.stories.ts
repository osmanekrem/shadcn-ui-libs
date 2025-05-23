import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "../src/components/custom/datatable";

const meta = {
  title: "Custom/CustomCard",
  component: DataTable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    data: { control: "object" },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [],
    columns: [],
  },
};

export const WithoutAction: Story = {
  args: {
    data: [],
    columns: [],
  },
};
