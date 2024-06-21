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
    " ": "../../../assets/Images/arrow.svg",
    "error": "../../../assets/Images/invalid.jpg"
  }

  public imageArray = signal<string[]>([]); // Array que será exibido na tela após a tradução da string de input

  private directionalInputs = ["f", "b", "u", "d", "F", "B", "U", "D", "df", "db", "uf", "ub", "dF", "dB", "uF", "uB"];
  private diagonalInputs = ["df", "db", "uf", "ub", "dF", "dB", "uF", "uB"];
  private numberInputs = ["1", "2", "3", "4"];
  private validDirectionConnectors = ["+", "/"];
  
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

  translateCombo(combo: string): void {
    console.log(combo);

    const maps = this._comboMappings;
    if(combo === "" || combo.length === 0) {
      this.imageArray.set([]);
      return;
    } else if(combo.length === 1) {
      if(!this._comboMappings[combo]) {
        return;
      } else {
        this.imageArray.set([maps[combo]]);
        return;
      }
    }

    let result: string[] = [];
    for(let i = 0; i < combo.length; i++) {
      let cur = combo[i];
      if (cur === " ") {
        result.push(maps[cur]);
      }

      if(cur === "!") {
        result.push(maps[cur]);
        continue;
      }

      if (cur.toLowerCase() == "w") { // While Running: f, f, F
        console.log(cur);

        if (i + 1 < combo.length && combo[i + 1].toLowerCase() == "r") { 
          result.push(maps["f"]);
          result.push(maps["f"]);
          result.push(maps["F"]);
          i++;
        } else {
          continue;
        }
      }

      if(cur.toLowerCase() == "c") {
        if(i + 2 < combo.length && combo[i + 1].toLowerCase() == "d" && this.isNumberInput(combo[i + 2])) {
          result.push(maps["f"]);
          result.push(maps["n"]);
          result.push(maps["d"]);
          result.push(maps["df"]);
          result.push(maps[combo[i + 2]]);
          i += 5;
          console.log(i);
        } else {
          continue;
        }
      }

      if(!this._comboMappings[cur]) {
        continue;
      }

      if(this.isNumberInput(cur)) {
        let str = cur;
        let plusCount = 0;

        while(i + 1 < combo.length && combo[i + 1] === "+" && plusCount <= 4 && i + 2 != combo.length) {
          plusCount++;
          i += 2;
          str += "+" + combo[i];
          if(Number(cur) > Number(combo[i])) {
            result.push(maps["error"]);
          }
        }

        console.log(str);

        result.push(maps[str]);
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
          } else {
            result.push(maps[cur]);
          }
        }
      }
    }

    console.log(result);
    

    this.imageArray.set(result);
  }
}
