const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const express = require("express");

test("unconfigured Cloudinary keeps real multipart case and avatar uploads on disk", async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "resqpaws-upload-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  // Node's test runner isolates this file in its own process. Never contact a
  // real account, even when a developer has Cloudinary configured locally.
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;
  const previous = process.cwd();
  let uploadCaseMedia, uploadAvatar;
  try {
    process.chdir(temporary);
    ({ uploadCaseMedia, uploadAvatar } = require("../config/cloudinary"));
  } finally {
    process.chdir(previous);
  }
  const app = express();
  app.post("/case", uploadCaseMedia.single("image"), (req, res) => res.json(req.file));
  app.post("/avatar", uploadAvatar.single("avatar"), (req, res) => res.json(req.file));
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;

  for (const [route, field, directory] of [["case", "image", "cases"], ["avatar", "avatar", "avatars"]]) {
    const form = new FormData();
    form.append(field, new Blob(["test image bytes"], { type: "image/png" }), "test photo.png");
    const response = await fetch(`${origin}/${route}`, { method: "POST", body: form });
    assert.equal(response.status, 200);
    const file = await response.json();
    assert.equal(file.destination, path.join(temporary, "uploads", directory));
    assert.match(file.filename, /^\d+-test-photo\.png$/);
    assert.equal(file.mimetype, "image/png");
    assert.equal(fs.readFileSync(file.path, "utf8"), "test image bytes");
  }
});
