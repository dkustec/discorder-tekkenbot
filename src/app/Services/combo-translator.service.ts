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
    "!": `${this.basePath}tornado.png`,
    "ssl": "../../../assets/Images/SSL.png",
    "ssr": "../../../assets/Images/SSR.png",
    "bracketL": "../../../assets/Images/bracketl.png",
    "bracketR": "../../../assets/Images/bracketr.png",
    "heat": "../../../assets/Images/heat.png",
    " ": "../../../assets/Images/arrow.svg",
    "error": "../../../assets/Images/invalid.svg"
  }

  public imageArray = signal<string[]>([]); // Signal that will be used to update the image array in the combo-output component

  private directionalInputs = ["f", "b", "u", "d", "F", "B", "U", "D", "df", "db", "uf", "ub", "dF", "dB", "uF", "uB"];
  private diagonalInputs = ["df", "db", "uf", "ub", "dF", "dB", "uF", "uB"];
  private numberInputs = ["1", "2", "3", "4"];
  private validDirectionConnectors = ["/"];
  private possibleChars = ["w", "c", "s", "h", "+", "/", ","]
  private specialInputs = ["ssr", "ssl", "cd", "wr", "ws"]
  
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

  // TODO: break this method down into smaller functions
  public translateCombo(combo: string): void {
    const maps = this._comboMappings;

    if(combo === "" || combo.length === 0) {
      this.imageArray.set([]);
      return;
    }

    let result: string[] = [];

    for(let i = 0; i < combo.length; i++) {
      let cur = combo[i];

      if(cur === ",") { // Ex: d, 2, 2 is valid
        if(i + 1 < combo.length && combo[i + 1] === " ") {
          i++;
        }
      }

      if (cur === "n" || cur === "!" || cur === " ") {
        result.push(maps[cur]);
      }

      if (!this._comboMappings[cur] && !this.possibleChars.includes(cur.toLowerCase())) {
        result.push(maps["error"]);
      }

      if (cur.toLowerCase() == "w") { // While Running: f, f, F
        if (i + 1 < combo.length && combo[i + 1].toLowerCase() == "r") { 
          result.push(maps["f"]);
          result.push(maps["f"]);
          result.push(maps["F"]);
          i++;
        } else {
          continue;
        }
      }

      if(cur.toLowerCase() == "c") { // Crouch Dash: f, n, d, df
        if(i + 1 < combo.length && combo[i + 1].toLowerCase() == "d") {
          result.push(maps["f"]);
          result.push(maps["n"]);
          result.push(maps["d"]);
          result.push(maps["df"]);
          i += 1;
        }
      }

      if(cur.toLowerCase() == "h") { // Heat burst
        if(i + 1 < combo.length && combo[i + 1].toLowerCase() == "b") {
          result.push(maps["heat"]);
          i += 1;
        }
      }

      if(cur.toLowerCase() == "s") { // Side step
        if(i + 1 < combo.length && combo[i + 1].toLowerCase() == "s") {
          if(i + 2 < combo.length && combo[i + 2].toLowerCase() == "r") {
            result.push(maps["ssr"]);
            i += 2;
          } else if(i + 2 < combo.length && combo[i + 2].toLowerCase() == "l") {
            result.push(maps["ssl"]);
            i += 2;
          }
        }
      }

      if(this.isNumberInput(cur)) {
        if(i + 1 < combo.length && combo[i + 1] === "~") { // press very quickly, ex: 1~2
          if(i + 2 < combo.length && this.isNumberInput(combo[i + 2])) {
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

        while(i + 1 < combo.length && combo[i + 1] === "+" && i + 2 != combo.length) {
          plusCount++;
          let prev = combo[i];
          i += 2;
          str += "+" + combo[i];

          if(Number(prev) > Number(combo[i])) {
            isInvalid = true;
            break;
          }

          if(plusCount > 3) {
            isInvalid = true;
            break;
          }
        }

        if(isInvalid) {
          result.push(maps["error"]);
        } else {
          result.push(maps[str]);
        }
      }

      if(this.isDirectionalInput(cur)) {
        if(i + 1 < combo.length && this.isDirectionalInput(combo[i + 1])) {
          let concat = cur + combo[i + 1];
          
          if(this.isDiagonalInput(concat)) {
            result.push(maps[concat]);
          } else {
            result.push(maps[cur]);
            result.push(maps[combo[i + 1]]);
          }
          i++;
        } else if (i + 1 < combo.length && this.isDirectionalConnector(combo[i + 1])) {
          if(i + 2 < combo.length && this.isDirectionalInput(combo[i + 2])) {
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
    }
    console.log(result);
    
    this.imageArray.set(result);
  }
}
