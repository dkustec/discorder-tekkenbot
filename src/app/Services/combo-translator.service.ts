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
    "hb": "../../../assets/Images/heat.png",
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
  private possibleChars = ["w", "c", "s", "h", "q", "i", "+", "/", ",", "{", "}"]
  private possibleSpecialInputs = ["ws", "iws", "bt", "dash", "ssl", "ssr", "ss", "ch", "hb", "wr", "cd", "qcf", "qcb", "hcb", "hcf"];
  private specialInputsMappings: { [key: string]: string[] } = {
    "ws": ["ws"],
    "iws": ["iws"],
    "bt": ["bt"],
    "dash": ["dash"],
    "ssl": ["ssl"],
    "ssr": ["ssr"],
    "ss": ["ss"],
    "ch": ["ch"],
    "hb": ["hb"],
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

    result = result.toLowerCase();

    if(this.specialInputsMappings[result]) {
      return [this.specialInputsMappings[result], indexOffset];
    } else {
      return [[result], indexOffset];
    }
  }

  private handleDirectionalInput(curString: string, curIndex: number): [string, number] {
    let result = curString[curIndex];
    let indexOffset = 0;
    const connector = "/";
    
    // convert to diagonal ex: df, db, uf, ub, dF, dB, uF, uB
    if (curIndex + 1 < curString.length && this.isDirectionalInput(curString[curIndex + 1])) {
      let concat = curString[curIndex] + curString[curIndex + 1];

      if (this.isDiagonalInput(concat)) {
        result = concat;
        indexOffset = 1;
      } else {
        result = curString[curIndex];
      }
    }

    // forward slash notation ex: d/f, d/b, u/f, u/b, d/F, d/B, u/F, u/B
    if (curIndex + 1 < curString.length && curString[curIndex + 1] === connector) {
      if (curIndex + 2 < curString.length && this.isDirectionalInput(curString[curIndex + 2])) {
        let concat = curString[curIndex] + curString[curIndex + 2];

        indexOffset = 2;
        if (this._comboMappings[concat]) {
          result = concat;
        } else {
          result = curString[curIndex];
        }
      }
    }

    return [result, indexOffset];
  }

  private handleNumberInput(curString: string, curIndex: number): [string[], number] {
    let result: string[] = [];
    let indexOffset = 0;

    // tilde notation ex: 1~2, 2~3, 3~4, 1~4
    if (curIndex + 1 < curString.length && curString[curIndex + 1] === "~") {
      let next = curString[curIndex + 2];
      let prev = curString[curIndex];

      result.push("bracketL");
      result.push(prev);
      result.push(next);
      result.push("bracketR");
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
      
      if (Number(next) < Number(prev)) {
        return [["error"], 0];
      }

      if (plusCount > 3) {
        console.log(plusCount);
        
        return [["error"], 0];
      }

      temp += "+";
      temp += next;

      i += 2;
      indexOffset += 2;
    }

    if (temp.length > 0) {
      result.push(temp);
      return [result, indexOffset];
    }

    return [result, indexOffset];
  }

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

      if (cur === "{") { // custom command
        let [customCommand, offset] = this.handleCustomCommand(combo, i);
        i += offset;
        result.push(customCommand);
      }


      if (this.isPossibleSpecialInput(cur.toLowerCase())) {
        let [specialInput, offset] = this.handleSpecialInputs(combo.substring(i).toLowerCase(), i, cur.toLowerCase());
        i += offset;

        if (specialInput.length > 1) {
          for (let j = 0; j < specialInput.length; j++) {
            result.push(maps[specialInput[j]]);
          }
        } else if (this.possibleSpecialInputs.includes(specialInput[0])) {
          result.push(maps[specialInput[0]]);
          
          continue;
        }
      }

      if (this.isDirectionalInput(cur)) {
        let [directionalInput, offset] = this.handleDirectionalInput(combo, i);
        i += offset;

        result.push(maps[directionalInput]);
      } 

      if (this.isNumberInput(cur)) {
        let [numberInput, offset] = this.handleNumberInput(combo, i);
        i += offset;

        for (let j = 0; j < numberInput.length; j++) {
          result.push(maps[numberInput[j]]);
        }
      }
    } 
    
    this.imageArray.set(result);
  }
}
