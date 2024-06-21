import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComboTranslatorService } from '../../Services/combo-translator.service';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss'
})

export class UserInputComponent {
  private _comboService;
  userInput: string = "";
  

  constructor(ComboTranslatorService: ComboTranslatorService) {
    this._comboService = ComboTranslatorService;
  }

  onInput(event: any) {
    this.userInput = event.target.value;
    this._comboService.translateCombo(this.userInput);
  }
}
