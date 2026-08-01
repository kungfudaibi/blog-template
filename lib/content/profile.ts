import { loadProfiles } from "./load";

export function loadAgentProfiles() {
  return loadProfiles({ includePrivate: false });
}
