import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject, timer, of } from 'rxjs';
import { repeatWhen, switchMap, takeUntil } from 'rxjs/operators';

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

  feedTimer$: Observable<any>;
  private readonly _startFeedTimer = new Subject<void>();
  private readonly _stopFeedTimer = new Subject<void>();

  playTimer: Observable<number>;
  restTimer: Observable<number>;

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
      feed: false,
      play: false,
      hug: false,
      teach: false,
      bath: false
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
    this.pet = {
      type: this.petType.value,
      name: this.petName.value,
      hunger: 5,
      hygiene: 1,
      education: 1,
      entertainment: 1
    };

    this.isGameStarted = this.petForm.valid;
    this.onStartTimer('feed', 3000);
  }

  onStartTimer(type: string, delay: number) {
    this.feedTimer$ = timer(delay, delay).pipe(
      switchMap(() => {
        return of(`${type}`);
      }),
      takeUntil(this._stopFeedTimer),
      repeatWhen(() => this._startFeedTimer)
    );

    this.feedTimer$.subscribe(
      (type: string) => {
        Object.keys(this.actionToggle)
          .filter(key => key !== type)
          .forEach(filteredKey => this.actionToggle[filteredKey] = true);
      }
    );
  }

  startFeedTimer(): void {
    this._startFeedTimer.next();
  }

  stopFeedTimer(): void {
    this._stopFeedTimer.next();
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

    this.startFeedTimer();
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
