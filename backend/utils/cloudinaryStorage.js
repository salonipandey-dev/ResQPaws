const { pipeline } = require("node:stream");

// Multer storage engine using the current Cloudinary SDK directly. Keep the
// metadata contract used by rescueController (path = URL, filename = public ID).
class CloudinaryStorage {
  constructor({ cloudinary, params }) {
    this.cloudinary = cloudinary;
    this.params = params;
  }

  _handleFile(_req, file, callback) {
    let settled = false;
    const done = (error, info) => {
      if (settled) return;
      settled = true;
      callback(error, info);
    };

    try {
      const upload = this.cloudinary.uploader.upload_stream(this.params, (error, result) => {
        if (error) return done(error);
        done(null, {
          path: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
          resource_type: result.resource_type,
        });
      });
      pipeline(file.stream, upload, (error) => {
        if (error) done(error);
      });
    } catch (error) {
      done(error);
    }
  }

  _removeFile(_req, file, callback) {
    const { filename, resource_type } = file;
    delete file.path;
    delete file.filename;
    delete file.size;
    delete file.resource_type;
    this.cloudinary.uploader.destroy(
      filename,
      { resource_type: resource_type || "image" },
      callback
    );
  }
}

module.exports = { CloudinaryStorage };
