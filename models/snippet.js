const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const snippetSchema = new Schema({
  id: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  codeBody: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  language: {
    type: String,
    required: true,
    enum: [
    " ",
    "HTML",
    "CSS",
    "JavaScript",
    "SCSS",
    "LESS",
    "JSON",
    "Plain Text",
    "Handlebars",
    "Jade",
    "Java",
    "JSX",
    "Text",
    "HAML",
    "C#",
    "CoffeeScript",
    "EJS",
    "Elixir",
    "Liquid",
    "Makefile",
    "Markdown",
    "MySQL",
    "pgSQL",
    "PHP",
    "Python",
    "Ruby",
    "SQL",
    "Stylus",
    "SVG",
    "XML",
    "YAML",
    "Other"
    ]
  },
  tags: {
    type: String
  },
  author: {
    type: String,
    required: true
  }
});

const Snippet = mongoose.model('snippet', snippetSchema);

module.exports = Snippet;