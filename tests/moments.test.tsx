import { describe, expect, it } from "vitest";

import { generateMetadata, generateStaticParams } from "@/app/moments/[slug]/page";
import { ContentSecurityError, getMomentBySlug, loadMoments } from "@/lib/content";

describe("moments content", () => {
  it("loads the supplied image without inventing the author's reflections", async () => {
    const moments = await loadMoments();

    expect(moments).toHaveLength(1);
    expect(moments[0]).toMatchObject({
      slug: "disco-elysium",
      metadata: {
        title: "极乐迪斯科",
        image: "/images/inspiration/disco-elysium-scene.png",
        width: 1918,
        height: 1078,
      },
      content: "",
    });
    expect(await getMomentBySlug("disco-elysium")).toEqual(moments[0]);
    await expect(getMomentBySlug("../disco-elysium"))
      .rejects.toBeInstanceOf(ContentSecurityError);
  });

  it("generates only real detail routes and their metadata", async () => {
    expect(await generateStaticParams()).toEqual([{ slug: "disco-elysium" }]);
    expect(await generateMetadata({ params: Promise.resolve({ slug: "disco-elysium" }) }))
      .toMatchObject({
        title: "极乐迪斯科 | zhujiechong",
        alternates: { canonical: "/moments/disco-elysium" },
      });
  });
});
