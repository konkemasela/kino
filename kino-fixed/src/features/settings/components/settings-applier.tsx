"use client";

import { useEffect } from "react";
import { applyDocumentSettings, getSettings, onSettingsChange } from "@/lib/settings-store";

export default function SettingsApplier() {
  useEffect(() => {
    const apply = () => applyDocumentSettings(getSettings());
    apply();
    return onSettingsChange(apply);
  }, []);

  return null;
}
