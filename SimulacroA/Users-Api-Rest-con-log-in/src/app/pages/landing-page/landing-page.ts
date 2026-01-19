import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-landing-page',
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {

}
