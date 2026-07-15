import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TrafficCard from "@/components/dashboard/TrafficCard";
import { TrafficData } from "@/types";

describe("TrafficCard", () => {
  it("renders upload and download speeds", () => {
    const traffic: TrafficData = {
      upload_mbps: 0.5,
      download_mbps: 1.2,
      packets_sent: 1000,
      packets_recv: 2000,
    };
    render(<TrafficCard traffic={traffic} />);
    expect(screen.getByText("0.50 MB/s")).toBeInTheDocument();
    expect(screen.getByText("1.20 MB/s")).toBeInTheDocument();
  });

  it("renders packet counts", () => {
    const traffic: TrafficData = {
      upload_mbps: 0.5,
      download_mbps: 1.2,
      packets_sent: 1234,
      packets_recv: 5678,
    };
    render(<TrafficCard traffic={traffic} />);
    expect(screen.getByText("Packets Sent: 1,234")).toBeInTheDocument();
    expect(screen.getByText("Packets Recv: 5,678")).toBeInTheDocument();
  });

  it("renders zeros when traffic is null", () => {
    render(<TrafficCard traffic={null} />);
    const zeros = screen.getAllByText("0.00 MB/s");
    expect(zeros.length).toBe(2);
  });
});
