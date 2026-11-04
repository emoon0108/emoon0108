import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

const requiredText = [
  "University of Michigan computer science engineering student",
  "mailto:ethmoon@umich.edu",
  "https://emoon0108.github.io/Ethan_Moon_Resume.pdf",
  "https://www.linkedin.com/in/ethan-moon0108/",
  "https://github.com/BoatingToast/nospoilers",
  "https://github.com/emoon0108/academic-planner",
  "https://github.com/emoon0108/ViolinTwin",
  "https://github.com/emoon0108/HealthyEaters",
  "https://github.com/emoon0108/sportlingo-referral-dashboard",
];

for (const value of requiredText) {
  assert.ok(readme.includes(value), `README is missing required recruiter signal: ${value}`);
}

for (const stale of [/\bincoming\b/i, /\/Users\//, /@gmail\.com/i, /@aquinas\.edu/i]) {
  assert.doesNotMatch(readme, stale, `README contains stale or private text: ${stale}`);
}

const selectedRows = readme
  .split("\n")
  .filter((line) => line.startsWith("| ["));
assert.equal(selectedRows.length, 5, "Selected work should stay focused on exactly five flagship projects");

const liveTargets = [
  ["portfolio", "https://emoon0108.github.io/", "text/html"],
  ["resume", "https://emoon0108.github.io/Ethan_Moon_Resume.pdf", "application/pdf"],
  ["NoSpoilers", "https://nospoilers.xyz/", "text/html"],
  ["ViolinTwin", "https://emoon0108.github.io/ViolinTwin/", "text/html"],
  ["Healthy Eaters", "https://emoon0108.github.io/HealthyEaters/", "text/html"],
  ["Referral Intelligence", "https://emoon0108.github.io/sportlingo-referral-dashboard/", "text/html"],
];

for (const [label, url, expectedType] of liveTargets) {
  const response = await fetch(url, {
    headers: { "user-agent": "emoon0108-profile-integrity-check" },
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  assert.ok(response.ok, `${label} returned HTTP ${response.status}`);
  const contentType = response.headers.get("content-type") ?? "";
  assert.ok(contentType.includes(expectedType), `${label} returned unexpected content type: ${contentType}`);
  await response.body?.cancel();
  console.log(`OK ${label}: ${response.status} ${contentType.split(";")[0]}`);
}

console.log("Profile copy and all six recruiter-facing destinations are valid.");
