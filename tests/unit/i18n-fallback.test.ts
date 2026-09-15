import { describe, expect, it } from "vitest";
import { getMessages } from "@/lib/i18n/request";

describe("locale message fallback", () => {
  it("retains untranslated nested English messages", async () => {
    const messages = await getMessages("mr");

    expect(messages.auth.phone).toBe("Phone number");
    expect(messages.actions.retry).toBe("Try again");
    expect(messages.stock.title).toBe("Stock management");
    expect(messages.nav.stock).toBe("मालसाठा");
  });
});
