import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Pet } from './shared/models/pet.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  petForm: FormGroup;
  petType: FormControl;
  petName: FormControl;
  isGameStarted: boolean;
  pet: Pet;
  counter: {[key: string]: number};
  actionToggle: {[key: string]: boolean};

  ngOnInit() {
    this.onInitPetForm();
    this.isGameStarted = false;

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

  onInitPetForm() {
    this.petType = new FormControl(null, [Validators.required]);
    this.petName = new FormControl(null, [Validators.required]);
    this.petForm = new FormGroup({
      petType: this.petType,
      petName: this.petName
    });
  }

  onStartGame() {
    console.log(this.petForm);
    this.pet = {
      type: this.petType.value,
      name: this.petName.value,
      hunger: 5,
      hygiene: 1,
      education: 1,
      entertainment: 1
    };

    this.isGameStarted = this.petForm.valid;
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
