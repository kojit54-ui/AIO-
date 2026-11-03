import { describe, expect, it } from "vitest";
import { providerErrorDetail } from "./provider";

describe("providerErrorDetail", () => {
  it("失敗の名前だけを取り出し、本文は入れない", async () => {
    const res = new Response(JSON.stringify({ error: { message: "秘密の本文 hello", code: "unsupported_parameter", param: "reasoning.effort" } }), { status: 400 });
    expect(await providerErrorDetail(res)).toBe("unsupported_parameter:reasoning.effort");
  });
  it("JSONでないときは何も返さない", async () => {
    expect(await providerErrorDetail(new Response("oops", { status: 400 }))).toBeUndefined();
  });
});
