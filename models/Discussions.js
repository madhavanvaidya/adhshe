// models/Discussion.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for Response
const responseSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Define the schema for Discussion
const discussionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: [responseSchema]
}, { timestamps: true });

// Create a model based on the schema
const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
