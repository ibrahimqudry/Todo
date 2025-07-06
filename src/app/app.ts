import { Component } from '@angular/core';
import { TodosPage } from "./todos-page/todos-page";

@Component({
  selector: 'app-root',
  imports:  [TodosPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Todo';
}
