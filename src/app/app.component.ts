import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor() {
    const updates = inject(SwUpdate);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updates.versionUpdates.subscribe((evt: any) => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
          break;
      }
    });

    afterNextRender(() => {
      initFlowbite();
    });
  }
}
