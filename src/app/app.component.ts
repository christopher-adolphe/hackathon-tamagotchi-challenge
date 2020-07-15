import { Component, OnInit } from '@angular/core';

import { Pet } from './shared/models/pet.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  pet: Pet;
  counter: {[key: string]: number};
  actionToggle: {[key: string]: boolean};

  ngOnInit() {
    this.pet = {
      name: 'Wally',
      hunger: 5,
      hygiene: 1,
      education: 1,
      entertainment: 1
    };

    this.counter = {
      feedCount: 0,
      playCount: 0,
      hugCount: 0,
      teachCount: 0,
      bathCount: 0
    };

    this.actionToggle = {
      feedDisabled: false,
      playDisabled: false,
      hugDisabled: false,
      teachDisabled: false,
      bathDisabled: false
    };
  }

  action(characteristic: string, counterName: string) {
    this.counter[counterName]++;

    if (characteristic !== 'hunger' && (this.pet[characteristic] < 5 && this.counter[counterName] == 3)) {
      this.pet[characteristic]++;

      this.resetCounter(counterName);
    } else if (characteristic === 'hunger' && (!(this.pet[characteristic] <= 1) && this.counter[counterName] == 3)) {
      this.pet[characteristic]--;

      this.resetCounter(counterName);
    }
  }

  checkCounter(counterName: string) {
    if (counterName === 'feedCount' && this.counter.feedCount == 3) {
      this.actionToggle = {
        feedDisabled: true,
        playDisabled: true,
        hugDisabled: true,
        teachDisabled: true,
        bathDisabled: false
      };
    }
  }

  resetCounter(counterName: string) {
    this.counter[counterName] = 0;
  }
}
