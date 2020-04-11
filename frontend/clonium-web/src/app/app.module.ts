import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import {SameDeviceRoomComponent} from './pages/room/same-device-room.component';
import {OnlineRoomComponent} from './pages/room/online-room.component';
import { RoomContainerComponent } from './pages/room-container/room-container.component';
import {FormsModule} from '@angular/forms';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    JoinRoomComponent,
    MainLayoutComponent,
    SameDeviceRoomComponent,
    OnlineRoomComponent,
    RoomContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    CoreModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
