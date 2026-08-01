import Image from "next/image";

import styles from "./InspirationFeature.module.css";

export function InspirationFeature() {
  return (
    <section className={styles.feature} aria-label="视觉灵感">
      <div className={styles.heading}>
        <div>
          <p className="eyebrow">02 / VISUAL LOG</p>
          <p className={styles.signal} aria-hidden="true">
            PAINT / STORY / INTERFACE
          </p>
        </div>
        <div>
          <h2>最近让我着迷的世界</h2>
          <p>
            我喜欢《极乐迪斯科》把绘画、文字与界面揉进同一种叙事里：粗粝、浓烈，
            又愿意给思考留下很长的回声。
          </p>
        </div>
      </div>

      <figure className={styles.figure}>
        <div className={styles.frame}>
          <Image
            className={styles.image}
            src="/images/inspiration/disco-elysium-scene.png"
            alt="《极乐迪斯科》游戏画面：人物站在明亮的抽象画作与昆虫前"
            width={1918}
            height={1078}
            loading="eager"
            sizes="(max-width: 1200px) calc(100vw - 2rem), 1200px"
          />
        </div>
        <figcaption className={styles.caption}>
          <span>灵感档案 001</span>
          <p>
            《极乐迪斯科》游戏画面截图。素材由站主提供，仅作个人审美与创作灵感展示；
            游戏及相关视觉资产归其权利人所有。
          </p>
        </figcaption>
      </figure>
    </section>
  );
}
