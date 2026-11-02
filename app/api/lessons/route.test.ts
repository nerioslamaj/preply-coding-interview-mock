// @vitest-environment node

import { expect, it } from "vitest";
import { GET } from "./route";

it("returns future requested and confirmed lessons for status=upcoming", async () => {
  const response = await GET(
    new Request("http://localhost:3000/api/lessons?tutorId=tutor_a&status=upcoming"),
  );
  const body = (await response.json()) as { lessons: { id: string }[] };

  expect(body.lessons.map((lesson) => lesson.id)).toEqual([
    "les_en_requested",
    "les_en_confirmed",
    "les_es_confirmed",
  ]);
});
