import { Component, OnInit, computed, input } from '@angular/core';
import { ComboTranslatorService } from '../../Services/combo-translator.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-combo-output',
  standalone: true,
  imports: [],
  templateUrl: './combo-output.component.html',
  styleUrl: './combo-output.component.scss'
})
export class ComboOutputComponent implements OnInit {
  private _comboService;
  private _activatedRoute;
  public images = computed(() => this._comboService.imageArray());

  constructor(
    comboTranslatorService: ComboTranslatorService,
    route: ActivatedRoute
  ) {
    this._comboService = comboTranslatorService;
    this._activatedRoute = route;
  }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      const combo = params['combo'];
      
      if (combo) {
        this._comboService.translateCombo(combo);
      }
    });
    
  }
}
