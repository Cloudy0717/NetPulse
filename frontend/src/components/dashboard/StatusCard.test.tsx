import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusCard from "@/components/dashboard/StatusCard";
import { Cpu } from "lucide-react";

describe("StatusCard", () => {
  it("renders title and value", () => {
    render(
      <StatusCard
        icon={Cpu}
        title="CPU Usage"
        value={45}
        color="text-blue-400"
      />,
    );
    expect(screen.getByText("CPU Usage")).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("renders with subtitle", () => {
    render(
      <StatusCard
        icon={Cpu}
        title="CPU Usage"
        value={45}
        color="text-blue-400"
        subtitle="Normal"
      />,
    );
    expect(screen.getByText("Normal")).toBeInTheDocument();
  });

  it("rounds decimal values", () => {
    render(
      <StatusCard icon={Cpu} title="CPU" value={45.7} color="text-blue-400" />,
    );
    expect(screen.getByText("46%")).toBeInTheDocument();
  });
});
