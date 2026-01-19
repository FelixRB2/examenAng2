import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Users-Api-Rest');
}
