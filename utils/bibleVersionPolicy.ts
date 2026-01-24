import { getVersionById } from "@/constants/bible-versions";

// KJV is bundled offline in `assets/bible/kjv.json`.
export function getEffectiveBibleVersionId(opts: {
  preferredVersionId: string;
  offlineModeEnabled: boolean;
}): string {
  return opts.offlineModeEnabled ? "kjv" : opts.preferredVersionId;
}

export function getEffectiveBibleVersionAbbr(opts: {
  preferredVersionId: string;
  offlineModeEnabled: boolean;
}): string {
  const id = getEffectiveBibleVersionId(opts);
  return getVersionById(id)?.abbreviation ?? "KJV";
}

