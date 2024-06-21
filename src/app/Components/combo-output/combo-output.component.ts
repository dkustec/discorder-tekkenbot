import { Component, OnInit, computed } from '@angular/core';
import { ComboTranslatorService } from '../../Services/combo-translator.service';

@Component({
  selector: 'app-combo-output',
  standalone: true,
  imports: [],
  templateUrl: './combo-output.component.html',
  styleUrl: './combo-output.component.scss'
})
export class ComboOutputComponent {
  private _comboService;
  images = computed(() => this._comboService.imageArray());

  constructor(comboTranslatorService: ComboTranslatorService) {
    this._comboService = comboTranslatorService;
  }
}
