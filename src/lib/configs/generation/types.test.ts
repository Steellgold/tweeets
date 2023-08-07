import { it, expect } from "vitest";
import { testProSelected } from "./types";

it("test if without pro, selected pro features pass or no", () => {
  expect(testProSelected(false, ["sentiment-calm", "style-poetic", "tone-optimistic"])).toBe(false);
  expect(testProSelected(false, ["sentiment-calm", "tone-optimistic", "tone-motivational"])).toBe(false);
  expect(testProSelected(false, ["sentiment-calm", "tone-optimistic", "sentiment-energetic"])).toBe(true);
});