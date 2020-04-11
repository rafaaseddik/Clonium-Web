import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainLayoutComponent} from './pages/main-layout/main-layout.component';
import {AboutComponent} from './pages/about/about.component';
import {HomeComponent} from './pages/home/home.component';
import {JoinRoomComponent} from './pages/join-room/join-room.component';
import {RoomContainerComponent} from './pages/room-container/room-container.component';
import {SameDeviceRoomComponent} from './pages/room/same-device-room.component';
import {OnlineRoomComponent} from './pages/room/online-room.component';


const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: 'about', component: AboutComponent},
      {path: 'home', component: HomeComponent},
      {path: 'join-room', component: JoinRoomComponent},
      {
        path: 'room', component: RoomContainerComponent, children: [
          {path: 'single-device', component: SameDeviceRoomComponent},
          {path: 'online', component: OnlineRoomComponent},
        ]
      },
      {path: '', redirectTo: 'home', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
