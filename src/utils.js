/* global chroma */

function parseColor (color, defaultColor) {
  if (chroma.valid(color)) {
    return chroma(color).hex();
  } else {
    return defaultColor || '#000000';
  }
}

function lineBreaksToHtml (str) {
  return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

function fixLineBreaks (str) {
  return str.replace('\r\n', '\r\n');
}

function stripHtml (str) {
  return str.replace(/(<([^>]+)>)/ig, '');
}

let utils = {
  parseColor: parseColor,
  lineBreaksToHtml: lineBreaksToHtml,
  fixLineBreaks: fixLineBreaks,
  stripHtml: stripHtml
};

export default utils;
