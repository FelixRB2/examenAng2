import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbBar } from "./components/navb-bar/navb-bar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('endgame');
}
