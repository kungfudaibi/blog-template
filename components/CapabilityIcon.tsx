type CapabilityIconProps = {
  slug: string;
};

export function CapabilityIcon({ slug }: CapabilityIconProps) {
  let drawing;

  switch (slug) {
    case "hpc-ai-infra":
      drawing = <><rect x="3" y="4" width="7" height="7" rx="1.3" /><rect x="14" y="4" width="7" height="7" rx="1.3" /><rect x="8.5" y="15" width="7" height="6" rx="1.3" /><path d="M6.5 11v2h11v-2M12 13v2" /></>;
      break;
    case "agent-development":
      drawing = <><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="m6.7 7 4 8m6.6-8-4 8M7 6h10" /></>;
      break;
    case "systems":
      drawing = <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M10 10h4v4h-4zM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4" /></>;
      break;
    case "security":
      drawing = <><path d="M12 2 4.5 5v6.2c0 5.1 3 8.3 7.5 10.8 4.5-2.5 7.5-5.7 7.5-10.8V5L12 2Z" /><path d="m9 11.8 2.2 2.2 4-4.5" /></>;
      break;
    case "embedded":
      drawing = <><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="9" cy="9" r="1.4" /><circle cx="15" cy="15" r="1.4" /><path d="M10.4 9H15v4.6M4 15h4m8-6h4" /></>;
      break;
    case "algorithms":
      drawing = <><circle cx="5" cy="5" r="1.7" /><circle cx="19" cy="5" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="5" cy="19" r="1.7" /><circle cx="19" cy="19" r="1.7" /><path d="m6.5 6.5 4 4m7-4-4 4m-3 3-4 4m7-4 4 4" /></>;
      break;
    default:
      drawing = <circle cx="12" cy="12" r="8" />;
  }

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      {drawing}
    </svg>
  );
}
