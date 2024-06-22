import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComboTranslatorService {
  private isColor = false;
  private colorImg = this.isColor ? "Tekken7" : "Tekken8"
  private basePath = `../../../assets/Images/${this.colorImg}/`;

  private _comboMappings: { [key: string]: string } = {
    "f": `${this.basePath}f.png`,
    "b": `${this.basePath}b.png`,
    "u": `${this.basePath}u.png`,
    "d": `${this.basePath}d.png`,
    "df": `${this.basePath}df.png`,
    "db": `${this.basePath}db.png`,
    "uf": `${this.basePath}uf.png`,
    "ub": `${this.basePath}ub.png`,
    "dF": `${this.basePath}dfhold.png`,
    "dB": `${this.basePath}dbhold.png`,
    "uF": `${this.basePath}ufhold.png`,
    "uB": `${this.basePath}ubhold.png`,
    "n": `${this.basePath}n.png`,
    "1": `${this.basePath}1.png`,
    "2": `${this.basePath}2.png`,
    "3": `${this.basePath}3.png`,
    "4": `${this.basePath}4.png`,
    "1+2": `${this.basePath}1+2.png`,
    "1+3": `${this.basePath}1+3.png`,
    "1+4": `${this.basePath}1+4.png`,
    "2+3": `${this.basePath}2+3.png`,
    "2+4": `${this.basePath}2+4.png`,
    "3+4": `${this.basePath}3+4.png`,
    "1+2+3": `${this.basePath}1+2+3.png`,
    "1+2+4": `${this.basePath}1+2+4.png`,
    "1+3+4": `${this.basePath}1+3+4.png`,
    "2+3+4": `${this.basePath}2+3+4.png`,
    "1+2+3+4": `${this.basePath}1+2+3+4.png`,
    "F": `${this.basePath}fhold.png`,
    "B": `${this.basePath}bhold.png`,
    "U": `${this.basePath}uhold.png`,
    "D": `${this.basePath}dhold.png`,
    // global commands
    "!": "../../../assets/Images/tornado.png",
    "ch": "../../../assets/Images/CH.png",
    "ss": "../../../assets/Images/SS.png",
    "ssl": "../../../assets/Images/SSL.png",
    "ssr": "../../../assets/Images/SSR.png",
    "bracketL": "../../../assets/Images/bracketl.png",
    "bracketR": "../../../assets/Images/bracketr.png",
    "heat": "../../../assets/Images/heat.png",
    " ": "../../../assets/Images/arrow.svg",
    "error": "../../../assets/Images/invalid.svg",
    "dash": "../../../assets/Images/DASH.png",
    "delay": "../../../assets/Images/DELAY.png",
    "ws": "../../../assets/Images/ws.png",
    "iws": "../../../assets/Images/iWS.png",
    "bt": "../../../assets/Images/BT.png",
  }

  public imageArray = signal<string[]>([]); // Signal that will be used to update the image array in the combo-output component

  private directionalInputs = ["f", "b", "u", "d", "F", "B", "U", "D", "df", "db", "uf", "ub", "dF", "dB", "uF", "uB"];
  private diagonalInputs = ["df", "db", "uf", "ub", "dF", "dB", "uF", "uB"];
  private numberInputs = ["1", "2", "3", "4"];
  private validDirectionConnectors = ["/"];
  private possibleChars = ["w", "c", "s", "h", "q", "i", "+", "/", ",", "{", "}"]
  private possibleSpecialInputs = ["ws", "iws", "bt", "dash", "ssl", "ssr", "ss", "ch", "heat", "wr", "cd", "qcf", "qcb", "hcb", "hcf"];
  private specialInputsMappings: { [key: string]: string[] } = {
    "ws": ["ws"],
    "iws": ["iws"],
    "bt": ["bt"],
    "dash": ["dash"],
    "ssl": ["ssl"],
    "ssr": ["ssr"],
    "ss": ["ss"],
    "ch": ["ch"],
    "heat": ["heat"],
    // multiple inputs
    "wr": ["f", "f", "F"],
    "cd": ["f", "n", "d", "df"],
    "qcf": ["d", "df", "f"],
    "qcb": ["d", "db", "b"],
    "hcb": ["f", "df", "d", "db", "b"],
    "hcf": ["b", "db", "d", "df", "f"]
  };

  
  constructor() { }

  private isDirectionalInput(input: string): boolean {
    return this.directionalInputs.includes(input);
  }

  private isDirectionalConnector(input: string): boolean {
    return this.validDirectionConnectors.includes(input);
  }

  private isNumberInput(input: string): boolean {
    return this.numberInputs.includes(input);
  }

  private isDiagonalInput(input: string): boolean {
    return this.diagonalInputs.includes(input);
  }

  private isPossibleSpecialInput(input: string): boolean {
    for (let i = 0; i < this.possibleSpecialInputs.length; i++) {
      if (this.possibleSpecialInputs[i].startsWith(input)) {
        return true;
      }
    }
    return false;
  }

  private handleCustomCommand(curString: string, curIndex: number): [string, number] {
    let indexOffset = 0;
    let customCommand = "";

    let i = curIndex + 1;
    while (i < curString.length && curString[i] !== "}") {
      customCommand += curString[i];
      i++;
    }

    indexOffset = customCommand.length + 1;
    return [customCommand, indexOffset];
  }

  private handleSpecialInputs(curString: string, curIndex: number, startingLetter: string): [string[], number] {
    let result = curString[curIndex];
    let indexOffset = 0;
    let possibleSpecialInputs = this.possibleSpecialInputs.filter(input => input.startsWith(startingLetter));
    
    if (possibleSpecialInputs.length === 0) {
      return [[result], indexOffset];
    }

    for (let i = 0; i < possibleSpecialInputs.length; i++) {
      let input = possibleSpecialInputs[i];
      let isMatch = true;
      let attemptedDepth = 0;

      for (let j = 0; j < input.length; j++) {
        attemptedDepth = j;

        if (curString[j] !== input[j]) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        result = input;
        indexOffset = input.length - 1;
        break;
      } else {
        result = curString.substring(curIndex, curIndex + attemptedDepth + 1);
      }
    }

    if(this.specialInputsMappings[result]) {
      return [this.specialInputsMappings[result], indexOffset];
    } else {
      return [[result], indexOffset];
    }
  }

  // TODO: break this method down into smaller functions
  public translateCombo(combo: string): void {
    const maps = this._comboMappings;

    if (combo === "" || combo.length === 0) {
      this.imageArray.set([]);
      return;
    }

    const result: string[] = [];

    for (let i = 0; i < combo.length; i++) {
      let cur = combo[i];

      if (cur === ",") { // Ex: d, 2, 2 is valid
        if (i + 1 < combo.length && combo[i + 1] === " ") {
          i++;
        }
      }

      if (cur === "n" || cur === "!" || cur === " ") {
        result.push(maps[cur]);
      }

      if (!this._comboMappings[cur] && !this.possibleChars.includes(cur.toLowerCase())) {
        result.push(maps["error"]);
      }

      if (this.isPossibleSpecialInput(cur.toLowerCase())) {
        let [specialInput, offset] = this.handleSpecialInputs(combo.substring(i), i, cur.toLowerCase());
        i += offset;

        if (specialInput.length > 1) {
          for (let j = 0; j < specialInput.length; j++) {
            result.push(maps[specialInput[j]]);
          }
        } else if (this.possibleSpecialInputs.includes(specialInput[0])) {
          result.push(maps[specialInput[0]]);
        }
      }

      if (this.isDirectionalInput(cur)) {
        if (i + 1 < combo.length && this.isDirectionalInput(combo[i + 1])) {
          let concat = cur + combo[i + 1];

          if (this.isDiagonalInput(concat)) {
            result.push(maps[concat]);
          } else {
            result.push(maps[cur]);
            result.push(maps[combo[i + 1]]);
          }
          i++;
        } else if (i + 1 < combo.length && this.isDirectionalConnector(combo[i + 1])) {
          if (i + 2 < combo.length && this.isDirectionalInput(combo[i + 2])) {
            let concat = cur + combo[i + 2];

            i += 2;
            if (maps[concat]) {
              result.push(maps[concat]);
            } else {
              result.push(maps[cur]);
            }
          }
        } else {
          result.push(maps[cur]);
        }
      } 

      if(cur === "{") { // custom command
        let [customCommand, offset] = this.handleCustomCommand(combo, i);
        i += offset;
        result.push(customCommand);
      }

      if (this.isNumberInput(cur)) {
        if (i + 1 < combo.length && combo[i + 1] === "~") { // press very quickly, ex: 1~2
          if (i + 2 < combo.length && this.isNumberInput(combo[i + 2])) {
            result.push(maps["bracketL"]);
            result.push(maps[cur]);
            result.push(maps[combo[i + 2]]);
            result.push(maps["bracketR"]);
            i += 2;
            continue;
          } 
        }

        let str = cur;
        let plusCount = 0;
        let isInvalid = false;

        while (i + 1 < combo.length && combo[i + 1] === "+" && i + 2 != combo.length) {
          plusCount++;
          let prev = combo[i];
          i += 2;
          str += "+" + combo[i];

          if (Number(prev) > Number(combo[i])) {
            isInvalid = true;
            break;
          }

          if (plusCount > 3) {
            isInvalid = true;
            break;
          }
        }

        if (isInvalid) {
          result.push(maps["error"]);
        } else {
          result.push(maps[str]);
        }
      }

      
      
    } 

    this.imageArray.set(result);
  }
}
