import { loadProfiles } from "./load";

type AgentProfileOptions = {
  contentRoot?: string;
};

export function loadAgentProfiles(options: AgentProfileOptions = {}) {
  return loadProfiles({ ...options, includePrivate: false });
}
