import { describe, expect, it } from "vitest";
import { visitorId } from "./tryoutVisitor";

describe("ためした人の目印", () => {
  it("同じIPなら、ブラウザの種類を変えても同じ目印", () => {
    const a = visitorId(new Headers({ "x-real-ip": "1.2.3.4", "user-agent": "A" }), "s");
    const b = visitorId(new Headers({ "x-real-ip": "1.2.3.4", "user-agent": "B" }), "s");
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });
  it("IPがちがえば別、秘密がちがえば別。元のIPは含まない", () => {
    const a = visitorId(new Headers({ "x-real-ip": "1.2.3.4" }), "s");
    expect(visitorId(new Headers({ "x-real-ip": "5.6.7.8" }), "s")).not.toBe(a);
    expect(visitorId(new Headers({ "x-real-ip": "1.2.3.4" }), "t")).not.toBe(a);
    expect(a).not.toContain("1.2.3.4");
  });
  it("x-real-ip が無ければ x-forwarded-for の先頭を使う", () => {
    expect(visitorId(new Headers({ "x-forwarded-for": "1.2.3.4, 9.9.9.9" }), "s")).toBe(visitorId(new Headers({ "x-real-ip": "1.2.3.4" }), "s"));
  });
});
