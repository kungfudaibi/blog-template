import Image from "next/image";

import styles from "./CharacterAccent.module.css";

const characterNames = {
  gugugaga: "咕咕嘎嘎",
  doro: "Doro",
  phoebe: "菲比啾比",
  phrolova: "弗糯糯",
} as const;

type CharacterAccentProps = {
  character: keyof typeof characterNames;
};

export function CharacterAccent({ character }: CharacterAccentProps) {
  return (
    <span className={`${styles.accent} ${styles[character]}`}>
      <span className={styles.art}>
        <Image
          src="/images/characters/four-companions-v2.png"
          alt={characterNames[character]}
          width={210}
          height={74}
        />
      </span>
    </span>
  );
}
