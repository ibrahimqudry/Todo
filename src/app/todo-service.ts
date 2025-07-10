import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  url = 'https://jsonplaceholder.typicode.com/todos';
  constructor(private http: HttpClient) { }


  // This method fetches todos from the API and returns a promise that resolves to an array of todos.

  getTodos() {
    return this.http.get<Todo[]>(this.url, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
    );
  }

  // This method posts a new todo to the API and returns an observable that emits the created todo.
  // It accepts a title and a completed status as parameters.

  postTodo(title: string, completed: boolean) {
    const newTodo = {
      userId: 1,
      title: title,
      completed: completed
    };
    return this.http.post<Todo>(this.url, newTodo, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
    );
  }


  // This method updates an existing todo by its ID and returns an observable that emits the updated todo.
  // It accepts a todo object as a parameter.
  updateTodo(todo: Todo) {
    return this.http.put<Todo>(`${this.url}/${todo.id}`, todo, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  }


  // This method deletes a todo by its ID and returns an observable that emits void.
  // It accepts a todoId as a parameter.
  deleteTodo(todoId: number) {
    return this.http.delete<void>(`${this.url}/${todoId}`, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  }
}

// This interface defines the structure of a Todo object.
// It includes properties for userId, id, title, and completed status.
export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}