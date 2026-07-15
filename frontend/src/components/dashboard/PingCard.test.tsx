import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PingCard from "@/components/dashboard/PingCard";
import { PingData } from "@/types";

describe("PingCard", () => {
  it("renders online status", () => {
    const ping: PingData = {
      host: "google.com",
      latency_ms: 15,
      status: "online",
    };
    render(<PingCard ping={ping} />);
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText("google.com")).toBeInTheDocument();
    expect(screen.getByText("15 ms")).toBeInTheDocument();
  });

  it("renders offline status", () => {
    const ping: PingData = {
      host: "google.com",
      latency_ms: null,
      status: "timeout",
    };
    render(<PingCard ping={ping} />);
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("renders N/A when ping is null", () => {
    render(<PingCard ping={null} />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
