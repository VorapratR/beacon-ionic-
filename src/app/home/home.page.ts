import { IBeacon, IBeaconPluginResult } from '@ionic-native/ibeacon/ngx';
import { Component } from '@angular/core';
import { EstimoteBeacons } from '@ionic-native/estimote-beacons/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private isAdvertisingAvailable: boolean = null;

  private uuid = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D';
  beaconData = {};
  beaconUuid = '';

  constructor(
    // private ibeacon: IBeacon,
    private eb: EstimoteBeacons,
    private readonly ibeacon: IBeacon,
    private readonly platform: Platform
  ) {
    this.enableDebugLogs();
  }

  IBeaconTest() {
    const beaconRegion = this.ibeacon.BeaconRegion('blueberry', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D');

    this.ibeacon.startMonitoringForRegion(beaconRegion)
      .then(
        () => console.log('Native layer received the request to monitoring'),
        error => console.error('Native layer failed to begin monitoring: ', error)
      );
  }

  EstimodeTest() {
    this.eb.requestAlwaysAuthorization().then(
      () => console.log('Native layer received the request to requestAlwaysAuthorization'),
        error => console.error('Native layer failed to begin requestAlwaysAuthorization: ', error)
    );
    this.eb.enableAnalytics(true).then(
      () => console.log('enableAnalytics'),
        error => console.error('Native layer failed to enableAnalytics ', error)
    );
  }

  public enableDebugLogs(): void {
    this.platform.ready().then(async () => {
      this.ibeacon.enableDebugLogs();
      this.ibeacon.enableDebugNotifications();
    });
  }

  public onStartClicked(): void {
    this.platform.ready().then(() => {
      this.startBleFun();
    });
  }

  public startBleFun(): void {

    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    const delegate = this.ibeacon.Delegate();

    this.ibeacon.setDelegate(delegate);
    this.beaconUuid = this.uuid;
    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
      .subscribe(
      (pluginResult: IBeaconPluginResult) => {
        console.log('didRangeBeaconsInRegion: ', pluginResult);
        this.beaconData = `Succ`;
      } ,
      (error: any) => this.beaconData = `Faill`
    );
    delegate.didStartMonitoringForRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => console.log('didStartMonitoringForRegion: ', pluginResult),
      (error: any) => console.error(`Failure during starting of monitoring: `, error)
    );

    delegate.didEnterRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => {
        console.log('didEnterRegion: ', pluginResult);
        this.beaconData = pluginResult;
      }
    );

    delegate.didExitRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => {
        console.log('didExitRegion: ', pluginResult);
      }
    );

    console.log(`Creating BeaconRegion with UUID of: `, this.uuid);
    const beaconRegion = this.ibeacon.BeaconRegion('nullBeaconRegion', this.uuid, 1, 1);

    this.ibeacon.startMonitoringForRegion(beaconRegion).then(
      () => console.log('Native layer recieved the request to monitoring'),
      (error: any) => console.error('Native layer failed to begin monitoring: ', error)
    );

    this.ibeacon.startRangingBeaconsInRegion(beaconRegion)
      .then(() => {
        console.log(`Started ranging beacon region: `, beaconRegion);
      })
      .catch((error: any) => {
        console.error(`Failed to start ranging beacon region: `, beaconRegion);
      });
  }

}
