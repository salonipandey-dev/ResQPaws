const test = require('node:test');
const assert = require('node:assert/strict');
const RescueCase = require('../models/RescueCase');
const { getRescueById } = require('../controllers/rescueController');

// Exercise the real controller with an isolated persistence stub.
test('case details enforce ownership and handle missing records', async () => {
  const original = RescueCase.findById;
  let record = { reportedBy: { _id: 'reporter' }, assignedTo: { _id: 'responder' } };
  RescueCase.findById = () => ({ populate() { return this; }, then(resolve) { resolve(record); } });
  try {
    for (const [id, role, allowed] of [['reporter','user',true], ['responder','ngo',true], ['outsider','user',false], ['outsider','ngo',false], ['admin','admin',true]]) {
      let result, error;
      await getRescueById({ params: { id: '507f1f77bcf86cd799439011' }, user: { _id: id, role } }, { json(value) { result = value; } }, err => { error = err; });
      if (allowed) { assert.equal(result.success, true); assert.equal(error, undefined); }
      else { assert.equal(error.statusCode, 403); assert.equal(result, undefined); }
    }
    record = null;
    let error;
    await getRescueById({ params: { id: '507f1f77bcf86cd799439011' }, user: { _id: 'reporter', role: 'user' } }, { json() { assert.fail('Missing case must not be returned'); } }, err => { error = err; });
    assert.equal(error.statusCode, 404);
  } finally { RescueCase.findById = original; }
});
