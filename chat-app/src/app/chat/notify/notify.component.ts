import { Component } from '@angular/core';
import { NotifyService } from './notify.service';
import { ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent {
  public toasterConfig: ToasterConfig;

  constructor(private notifyService: NotifyService) {
    this.toasterConfig = new ToasterConfig({
      timeout: 7500,
      animation: 'flyRight'
    });
  }
}
