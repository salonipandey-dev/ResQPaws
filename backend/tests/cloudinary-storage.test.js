const test = require("node:test");
const assert = require("node:assert/strict");
const { Readable, Writable } = require("node:stream");
const { CloudinaryStorage } = require("../utils/cloudinaryStorage");

const params = { folder: "resqpaws/cases", resource_type: "auto" };

test("Cloudinary uploads preserve options, bytes and controller metadata", async () => {
  let received = "";
  const cloudinary = {
    uploader: {
      upload_stream(options, done) {
        assert.deepEqual(options, params);
        return new Writable({
          write(chunk, _encoding, callback) {
            received += chunk.toString();
            callback();
          },
          final(callback) {
            done(null, {
              secure_url: "https://example.test/rescue.png",
              public_id: "resqpaws/cases/rescue",
              bytes: 5,
              resource_type: "image",
            });
            callback();
          },
        });
      },
    },
  };
  const storage = new CloudinaryStorage({ cloudinary, params });
  const info = await new Promise((resolve, reject) => {
    storage._handleFile({}, { stream: Readable.from(["photo"]) }, (error, value) => {
      if (error) reject(error);
      else resolve(value);
    });
  });
  assert.equal(received, "photo");
  assert.deepEqual(info, {
    path: "https://example.test/rescue.png",
    filename: "resqpaws/cases/rescue",
    size: 5,
    resource_type: "image",
  });
});

for (const failure of ["cloudinary", "source", "destination", "setup"]) {
  test(`${failure} errors reach Multer exactly once`, async () => {
    const expected = new Error(`${failure} failed`);
    let completeUpload;
    const destination = new Writable({
      write(_chunk, _encoding, callback) {
        if (failure === "destination") callback(expected);
        else {
          if (failure === "cloudinary") completeUpload(expected);
          callback();
        }
      },
    });
    const cloudinary = {
      uploader: {
        upload_stream(_options, done) {
          if (failure === "setup") throw expected;
          completeUpload = done;
          return destination;
        },
      },
    };
    const source = failure === "source"
      ? new Readable({ read() { this.destroy(expected); } })
      : Readable.from(["photo"]);
    const storage = new CloudinaryStorage({ cloudinary, params });
    let calls = 0;
    await new Promise((resolve) => {
      storage._handleFile({}, { stream: source }, (error) => {
        calls++;
        assert.equal(error, expected);
        resolve();
      });
    });
    // A later SDK callback must not complete an already failed upload again.
    if (completeUpload) completeUpload(expected);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(calls, 1);
  });
}

for (const resourceType of ["image", "video"]) {
  test(`Multer cleanup deletes the uploaded ${resourceType} with its resource type`, async () => {
    let destroyed;
    const storage = new CloudinaryStorage({
      cloudinary: {
        uploader: {
          destroy(id, options, done) {
            destroyed = { id, options };
            done(null, { result: "ok" });
          },
        },
      },
      params,
    });
    const file = { filename: "resqpaws/cases/report", path: "https://example.test/report", size: 5, resource_type: resourceType };
    await new Promise((resolve, reject) => {
      storage._removeFile({}, file, (error) => error ? reject(error) : resolve());
    });
    assert.deepEqual(destroyed, { id: "resqpaws/cases/report", options: { resource_type: resourceType } });
    assert.deepEqual(file, {});
  });
}

test("remote cleanup errors propagate to Multer", async () => {
  const expected = new Error("deletion failed");
  const storage = new CloudinaryStorage({
    cloudinary: { uploader: { destroy(_id, _options, done) { done(expected); } } },
    params,
  });
  await new Promise((resolve) => {
    storage._removeFile({}, { filename: "resqpaws/avatars/avatar" }, (error) => {
      assert.equal(error, expected);
      resolve();
    });
  });
});
