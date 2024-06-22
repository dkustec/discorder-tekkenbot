import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComboTranslatorService } from '../../Services/combo-translator.service';
import Swal from 'sweetalert2';

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

  onShareButtonClick() {
    Swal.fire("Copied to clipboard!");

    let normalizedToUrl = this.userInput.replace(/ /g, "%20");
    let url = `https://tekkenconverter.netlify.app?combo=${normalizedToUrl}`;
    
    navigator.clipboard.writeText(url);
  }
}
