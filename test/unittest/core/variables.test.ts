process.env.CI = "false";

import { PredefinedVariables } from "../../../src";

test("empty string if env CI is set", () => {
  expect(PredefinedVariables.CI).toBe("");
});
