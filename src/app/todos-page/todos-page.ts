import { Component, inject, Output, EventEmitter } from '@angular/core';
import { Todo, TodoService } from '../todo-service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, DialogModule, CheckboxModule, FormsModule, ConfirmDialogModule],
  templateUrl: './todos-page.html',
  styleUrl: './todos-page.css',
  providers: [ConfirmationService]
})

export class TodosPage {

  // Define the properties for the component
  todoService = inject(TodoService);
  confirmationService = inject(ConfirmationService);
  addTodoDialogVisible = false;
  title = '';
  completed = false;
  editTodoDialogVisible = false;
  editingTodo: Todo = { userId: 1, id: 0, title: '', completed: false };
  todos: Todo[] = [];

  // Getting todos from the service in the constructor
  // This is an asynchronous operation, so we will use async/await
  constructor() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(
      {
        next: (res) => { this.todos = res; },
        error: (err) => {
          console.error('Error fetching todos:', err);
        }
      }
    );
  }





  // Methods to handle adding, updating, and deleting todos
  // These methods will interact with the TodoService to perform CRUD operations
  // and update the local todos array accordingly



  // Add a new todo
  addTodo(title: string, completed: boolean) {
    if (title.trim()) {
      this.todoService.postTodo(title, completed).subscribe({
        next: (todo) => {
          const newTodo = {
            ...todo,
            id: this.todos[this.todos.length - 1].id + 1,
          };
          this.todos.push(newTodo);
        },
        error: (err) => {
          console.error('Error adding todo:', err);
        }
      });
    } else {
      console.warn('Todo title cannot be empty');
    }
    this.closeDialog();
  }

  // Update a todo's completed status
  // If the todo's id is greater than 200, we will not update it through the api and
  // instead updating the local todo array directly
  // Otherwise, we will call the updateTodo method from the TodoService
  updateTodoCompleted(todo: Todo, completed: boolean) {
    const updatedTodo = { ...todo, completed };
    if (todo.id > 200) {
      todo.completed = completed;
    }
    else {
      this.todoService.updateTodo(updatedTodo).subscribe({
        next: (res) => {
          todo.completed = res.completed;
        },
        error: (err) => {
          console.error('Error updating todo:', err);
        }
      });
    }
  }


  // Update a todo's title
  // If the todo's id is greater than 200, we will not update it through the api and
  // instead updating the local todo array directly
  // Otherwise, we will call the updateTodo method from the TodoService
  updateTodoTitle(title: string) {
    if (title.trim()) {
      // Use the editingTodo property for editing
      if (!this.editingTodo || !this.editingTodo.id) {
        console.warn('No todo selected for editing.');
        this.closeDialog();
        return;
      }
      const updatedTodo = {
        ...this.editingTodo,
        title,
      };
      if (this.editingTodo.id > 200) {
        const idx = this.todos.findIndex(t => t.id === updatedTodo.id);
        if (idx > -1) {
          this.todos[idx] = { ...this.todos[idx], ...updatedTodo };
        }
      } else {
        this.todoService.updateTodo(updatedTodo).subscribe({
          next: (todo) => {
            // Update the todo in the local array
            const idx = this.todos.findIndex(t => t.id === updatedTodo.id);
            if (idx > -1) {
              this.todos[idx] = { ...this.todos[idx], ...todo };
            }
          },
          error: (err) => {
            console.error('Error updating todo:', err);
          }
        });
      }
    } else {
      console.warn('Todo title cannot be empty');
    }
    this.closeDialog();
  }


  // Delete a todo
  deleteTodo(todoId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this todo?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.todoService.deleteTodo(todoId).subscribe({
          next: () => {
            // Remove the deleted todo from the local array
            this.todos = this.todos.filter(todo => todo.id !== todoId);
          },
          error: (err) => {
            console.error('Error deleting todo:', err);
          }
        });
      }
    });
  }

  openDialog() {
    this.addTodoDialogVisible = true;
    this.title = '';
    this.completed = false;
  }

  openEditingDialog(todo: Todo) {
    console.log(todo);

    this.editTodoDialogVisible = true;
    this.editingTodo = { ...todo };
    this.title = todo.title;
    this.completed = todo.completed;
  }

  closeDialog() {
    this.addTodoDialogVisible = false;
    this.editTodoDialogVisible = false;
    this.editingTodo = { userId: 1, id: 0, title: '', completed: false };
    this.title = '';
    this.completed = false;
  }
}
