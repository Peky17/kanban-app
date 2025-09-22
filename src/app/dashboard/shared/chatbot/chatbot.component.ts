import { TaskAssignationService } from 'src/app/services/task-assignation.service';
import { Component } from '@angular/core';
import { ChatbotService } from 'src/app/services/chatbot.service';
import { ChatbotResponse } from 'src/app/interfaces/chatbot.interface';
import { TaskAssignation } from 'src/app/interfaces/taskAssignation';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent {
  messages: Array<{
    from: 'user' | 'bot';
    text: string;
    tasks?: Array<TaskAssignation & { name: string }>;
  }> = [];
  userInput: string = '';
  loading: boolean = false;

  constructor(
    private chatbotService: ChatbotService,
    private taskAssignationService: TaskAssignationService
  ) {}

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({ from: 'user', text: this.userInput });
    this.loading = true;

    this.chatbotService
      .getProjectById({ userId: 1, message: this.userInput })
      .subscribe(
        (res: ChatbotResponse) => {
          this.messages.push({ from: 'bot', text: res.response });
          if (res.tasks && res.tasks.length > 0) {
            const tasksWithAssignation: Array<
              TaskAssignation & { name: string }
            > = [];
            let pending = res.tasks.length;
            res.tasks.forEach((task) => {
              this.taskAssignationService
                .getAssignationsByTaskId(task.id)
                .subscribe(
                  (assignations: TaskAssignation[]) => {
                    // Buscar la asignación para el usuario actual (ejemplo: userId=1)
                    const assignation = assignations.find(
                      (a) => a.task.id === task.id && a.user.id === 1
                    );
                    tasksWithAssignation.push({
                      id: assignation ? assignation.id : 0,
                      user: assignation ? assignation.user : { id: 1 },
                      task: assignation ? assignation.task : { id: task.id },
                      completed: assignation ? assignation.completed : false,
                      name: task.name,
                    });
                    pending--;
                    if (pending === 0) {
                      this.messages.push({
                        from: 'bot',
                        text: 'Tareas relacionadas:',
                        tasks: tasksWithAssignation,
                      });
                      this.loading = false;
                    }
                  },
                  () => {
                    tasksWithAssignation.push({
                      id: 0,
                      user: { id: 1 },
                      task: { id: task.id },
                      completed: false,
                      name: task.name,
                    });
                    pending--;
                    if (pending === 0) {
                      this.messages.push({
                        from: 'bot',
                        text: 'Tareas relacionadas:',
                        tasks: tasksWithAssignation,
                      });
                      this.loading = false;
                    }
                  }
                );
            });
          } else {
            this.loading = false;
          }
        },
        (err) => {
          this.messages.push({
            from: 'bot',
            text: 'Error al conectar con el asistente.',
          });
          this.loading = false;
        }
      );
    this.userInput = '';
  }
}
