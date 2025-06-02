// Combo logic extracted from Angular service for Node.js/Discord bot usage
// This module provides a function to translate a Tekken combo string into an array of symbolic representations (text for now)

const comboMappings = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "1+2": "1+2",
  "1+3": "1+3",
  "1+4": "1+4",
  "2+3": "2+3",
  "2+4": "2+4",
  "3+4": "3+4",
  "1+2+3": "1+2+3",
  "1+2+4": "1+2+4",
  "1+3+4": "1+3+4",
  "2+3+4": "2+3+4",
  "1+2+3+4": "1+2+3+4",
  "f": "f", "b": "b", "u": "u", "d": "d", "df": "df", "db": "db", "uf": "uf", "ub": "ub",
  "dF": "dF", "dB": "dB", "uF": "uF", "uB": "uB", "n": "n", "F": "F", "B": "B", "U": "U", "D": "D",
  "!": "!", "ch": "ch", "ss": "ss", "ssl": "ssl", "ssr": "ssr", "bracketL": "[", "bracketR": "]", "hb": "hb",
  " ": " ", "error": "error", "dash": "dash", "delay": "delay", "ws": "ws", "iws": "iws", "bt": "bt"
};

const directionalInputs = ["f", "b", "u", "d", "F", "B", "U", "D", "df", "db", "uf", "ub", "dF", "dB", "uF", "uB"];
const diagonalInputs = ["df", "db", "uf", "ub", "dF", "dB", "uF", "uB"];
const numberInputs = ["1", "2", "3", "4"];
const possibleChars = ["w", "c", "s", "h", "q", "i", "+", "/", ",", "{", "}"];
const possibleSpecialInputs = ["ws", "iws", "bt", "dash", "ssl", "ssr", "ss", "ch", "hb", "wr", "cd", "qcf", "qcb", "hcb", "hcf"];
const specialInputsMappings = {
  ws: ["ws"], iws: ["iws"], bt: ["bt"], dash: ["dash"], ssl: ["ssl"], ssr: ["ssr"], ss: ["ss"], ch: ["ch"], hb: ["hb"],
  wr: ["f", "f", "F"], cd: ["f", "n", "d", "df"], qcf: ["d", "df", "f"], qcb: ["d", "db", "b"], hcb: ["f", "df", "d", "db", "b"], hcf: ["b", "db", "d", "df", "f"]
};

function isDirectionalInput(input) { return directionalInputs.includes(input); }
function isNumberInput(input) { return numberInputs.includes(input); }
function isDiagonalInput(input) { return diagonalInputs.includes(input); }
function isPossibleSpecialInput(input) { return possibleSpecialInputs.some(i => i.startsWith(input)); }

function handleCustomCommand(curString, curIndex) {
  let indexOffset = 0, customCommand = "";
  let i = curIndex + 1;
  while (i < curString.length && curString[i] !== "}") { customCommand += curString[i]; i++; }
  indexOffset = customCommand.length + 1;
  return [customCommand, indexOffset];
}

function handleSpecialInputs(curString, curIndex, startingLetter) {
  let result = curString[curIndex];
  let indexOffset = 0;
  let possible = possibleSpecialInputs.filter(input => input.startsWith(startingLetter));
  if (possible.length === 0) return [[result], indexOffset];
  for (let input of possible) {
    let isMatch = true;
    for (let j = 0; j < input.length; j++) {
      if (curString[j] !== input[j]) { isMatch = false; break; }
    }
    if (isMatch) { result = input; indexOffset = input.length - 1; break; }
    else { result = curString.substring(curIndex, curIndex + input.length); }
  }
  result = result.toLowerCase();
  if (specialInputsMappings[result]) return [specialInputsMappings[result], indexOffset];
  else return [[result], indexOffset];
}

function handleDirectionalInput(curString, curIndex) {
  let result = curString[curIndex];
  let indexOffset = 0;
  const connector = "/";
  if (curIndex + 1 < curString.length && isDirectionalInput(curString[curIndex + 1])) {
    let concat = curString[curIndex] + curString[curIndex + 1];
    if (isDiagonalInput(concat)) { result = concat; indexOffset = 1; }
    else { result = curString[curIndex]; }
  }
  if (curIndex + 1 < curString.length && curString[curIndex + 1] === connector) {
    if (curIndex + 2 < curString.length && isDirectionalInput(curString[curIndex + 2])) {
      let concat = curString[curIndex] + curString[curIndex + 2];
      indexOffset = 2;
      if (comboMappings[concat]) result = concat;
      else result = curString[curIndex];
    }
  }
  return [result, indexOffset];
}

function handleNumberInput(curString, curIndex) {
  let result = [];
  let indexOffset = 0;
  if (curIndex + 1 < curString.length && curString[curIndex + 1] === "~") {
    let next = curString[curIndex + 2];
    let prev = curString[curIndex];
    result.push("bracketL"); result.push(prev); result.push(next); result.push("bracketR");
    indexOffset = 2;
    return [result, indexOffset];
  }
  let plusCount = 0;
  let i = curIndex;
  let temp = curString[i];
  while (i + 2 < curString.length && curString[i + 1] === "+") {
    plusCount++;
    let prev = curString[i];
    let next = curString[i + 2];
    if (Number(next) <= Number(prev)) return [["error"], 0];
    if (plusCount > 3) return [["error"], 0];
    temp += "+"; temp += next;
    i += 2; indexOffset += 2;
  }
  if (temp.length > 0) { result.push(temp); return [result, indexOffset]; }
  return [result, indexOffset];
}

function translateCombo(combo) {
  if (!combo || combo.length === 0) return [];
  const result = [];
  for (let i = 0; i < combo.length; i++) {
    let cur = combo[i];
    if (cur === ",") { if (i + 1 < combo.length && combo[i + 1] === " ") i++; }
    if (cur === "n" || cur === "!" || cur === " ") result.push(comboMappings[cur]);
    if (!comboMappings[cur] && !possibleChars.includes(cur.toLowerCase())) result.push(comboMappings["error"]);
    if (cur === "{") {
      let [customCommand, offset] = handleCustomCommand(combo, i);
      i += offset; result.push(customCommand);
    }
    if (isPossibleSpecialInput(cur.toLowerCase())) {
      let [specialInput, offset] = handleSpecialInputs(combo.substring(i).toLowerCase(), i, cur.toLowerCase());
      i += offset;
      if (specialInput.length > 1) { for (let j = 0; j < specialInput.length; j++) result.push(comboMappings[specialInput[j]]); }
      else if (possibleSpecialInputs.includes(specialInput[0])) { result.push(comboMappings[specialInput[0]]); continue; }
    }
    if (isDirectionalInput(cur)) {
      let [directionalInput, offset] = handleDirectionalInput(combo, i);
      i += offset; result.push(comboMappings[directionalInput]);
    }
    if (isNumberInput(cur)) {
      let [numberInput, offset] = handleNumberInput(combo, i);
      i += offset; for (let j = 0; j < numberInput.length; j++) result.push(comboMappings[numberInput[j]]); }
  }
  return result;
}

module.exports = { translateCombo };
