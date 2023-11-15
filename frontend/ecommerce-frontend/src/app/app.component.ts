import { Component } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Keepalive } from '@ng-idle/keepalive';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce-frontend';
  idleState = 'Not started.';
  timedOut = false;
  countdown: number | null = null;

  constructor(
    private idle: Idle,
    keepalive: Keepalive,
    private router: Router,
    private appService: AppService,
    private authService:AuthService
  ) {
    idle.setIdle(3600 );
    idle.setTimeout(60);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.'
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
     this.logout()
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      this.countdown = countdown;
    });

    keepalive.interval(10);
    keepalive.onPing.subscribe(() => {});

    this.appService.getUserLoggedIn().subscribe((userLoggedIn: any) => {
      if (userLoggedIn) {
        idle.watch()
        this.timedOut = false;
      } else {
        idle.stop();
      }
    })
  }

  reset() {
    this.idle.watch();
    this.timedOut = false;
    this.countdown = null;
  }

  stay() {
    this.reset();
  }

  logout() {
    this.countdown = null;
    this.appService.setUserLoggedIn(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
