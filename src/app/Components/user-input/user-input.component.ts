import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComboTranslatorService } from '../../Services/combo-translator.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss'
})

export class UserInputComponent implements OnInit{
  private _comboService;
  userInput: string = "";
  _activatedRoute;
  

  constructor(ComboTranslatorService: ComboTranslatorService, route: ActivatedRoute) {
    this._comboService = ComboTranslatorService;
    this._activatedRoute = route;
  }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      const combo = params['combo'];

      if (combo) {
        this.userInput = combo;
      }
    });
  }


  onInput(event: any) {
    this.userInput = event.target.value;
    this._comboService.translateCombo(this.userInput);
  }

  onShareButtonClick() {
    Swal.fire("Copied to clipboard!");

    let normalizedToUrl = this.userInput.replace(/ /g, "%20").replace(/\+/g, "%2B");
    let url = `https://tekkenconverter.netlify.app?combo=${normalizedToUrl}`;
    
    navigator.clipboard.writeText(url);
  }

  onColorButtonClick() {
    this._comboService.toggleColor();
    this._comboService.translateCombo(this.userInput);
  }
}
