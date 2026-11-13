"use client";

import { useEffect, useState } from "react";
import { useStudio } from "@/components/studio/StudioProvider";
import { REACHY_BUY_URL } from "@/lib/config";

type ReachyStatus = {
  connection: "disconnected" | "unavailable";
  adapter: string;
  nfcHat: string;
  message: string;
};

export default function StudioReachyPage() {
  const { state, setState, persist, setStatus } = useStudio();
  const [remote, setRemote] = useState<ReachyStatus | null>(null);

  useEffect(() => {
    void fetch("/api/reachy/status")
      .then((response) => response.json())
      .then((data: ReachyStatus) => {
        setRemote(data);
        setState((prev) => ({
          ...prev,
          robot: {
            ...prev.robot,
            connection: data.connection,
          },
        }));
      })
      .catch(() => {
        setRemote({
          connection: "unavailable",
          adapter: "status-check-failed",
          nfcHat: "planned",
          message: "Could not read adapter status. Treating connection as unavailable.",
        });
      });
  }, [setState]);

  const connectionLabel =
    (remote?.connection || state.robot.connection) === "disconnected"
      ? "Disconnected"
      : "Unavailable — adapter not configured";

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Reachy Mini</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">
          Hardware connection boundary
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Personality service stays separate from the hardware adapter. This page
          never fakes a successful connection.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel space-y-3 p-5">
          <h2 className="font-display text-xl">Connection status</h2>
          <p className="badge-soft badge-warn inline-flex">{connectionLabel}</p>
          <p className="text-sm text-[var(--ink-muted)]">
            {remote?.message ||
              "Checking adapter configuration… NFC hat assignment remains planned."}
          </p>
          <p className="text-xs text-[var(--ink-muted)]">
            Adapter: {remote?.adapter || "pending"} · NFC: {remote?.nfcHat || "planned"}
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              void fetch("/api/reachy/status")
                .then((response) => response.json())
                .then((data: ReachyStatus) => {
                  setRemote(data);
                  setState((prev) => ({
                    ...prev,
                    robot: { ...prev.robot, connection: data.connection },
                  }));
                  setStatus(
                    "Probe complete — no successful live robot session is claimed without a verified adapter.",
                  );
                });
            }}
          >
            Probe adapter (honest)
          </button>
        </div>

        <div className="panel space-y-3 p-5">
          <h2 className="font-display text-xl">Setup guidance</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--ink-soft)]">
            <li>Purchase hardware separately from Pollen Robotics.</li>
            <li>Install the official Reachy Mini software per vendor docs.</li>
            <li>Set <code>REACHY_MINI_ENDPOINT</code> server-side when ready.</li>
            <li>Select an approved personality below for future assignment.</li>
            <li>NFC hat assignment stays planned until officially verified.</li>
          </ol>
          <a
            href={REACHY_BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary inline-flex"
          >
            Buy Reachy Mini
          </a>
        </div>
      </div>

      <div className="panel space-y-4 p-5">
        <h2 className="font-display text-xl">Personality selection</h2>
        <label>
          <span className="label">Approved personality to assign later</span>
          <input
            className="field"
            value={state.robot.selectedPersonality}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                robot: { ...prev.robot, selectedPersonality: e.target.value },
              }))
            }
            placeholder={state.twin.displayName || "Select / name a personality"}
          />
        </label>
        <label>
          <span className="label">Notes for future adapter</span>
          <textarea
            className="field min-h-24"
            value={state.robot.notes}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                robot: { ...prev.robot, notes: e.target.value },
              }))
            }
            placeholder="Voice / expression preferences where supported"
          />
        </label>
        <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line)] p-4 text-sm text-[var(--ink-muted)]">
          Preview / test: unavailable until a verified hardware adapter is
          configured. NFC hat assignment: <strong>planned</strong>.
        </div>
        <button type="button" className="btn btn-primary" onClick={persist}>
          Save Reachy preferences locally
        </button>
      </div>
    </div>
  );
}
