import {
  CAPABILITY_STATUS_LABELS,
  type CapabilityStatus as CapabilityStatusValue,
} from "@/lib/content";

import styles from "./CapabilityMap.module.css";

type CapabilityStatusProps = {
  status: CapabilityStatusValue;
};

export function CapabilityStatus({ status }: CapabilityStatusProps) {
  return (
    <span className={styles.status} data-status={status}>
      {CAPABILITY_STATUS_LABELS[status]}
    </span>
  );
}
