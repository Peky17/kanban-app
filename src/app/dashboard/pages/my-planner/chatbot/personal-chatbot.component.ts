import { Component, Output, EventEmitter } from '@angular/core';
import { ChatbotService } from 'src/app/services/chatbot.service';
import { AuthService } from 'src/app/services/auth.service';
import { TaskAssignationService } from 'src/app/services/task-assignation.service';
import { ChatbotResponse } from 'src/app/interfaces/chatbot.interface';
import { TaskAssignation } from 'src/app/interfaces/taskAssignation';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal-chatbot',
  templateUrl: './personal-chatbot.component.html',
  styleUrls: ['./personal-chatbot.component.css'],
  standalone: true,
  imports: [NgStyle, NgClass, NgFor, NgIf, FormsModule],
})
export class PersonalChatbotComponent {
  // Drag and drop
  dragging = false;
  dragOffset = { x: 0, y: 0 };
  chatbotPosition = { x: null as number | null, y: null as number | null };
  @Output() close = new EventEmitter<void>();
  messages: Array<{
    from: 'user' | 'bot';
    text: string;
    tasks?: Array<TaskAssignation & { name: string }>;
  }> = [];
  userInput: string = '';
  loading: boolean = false;

  expanded: boolean = false;
  currentUserId: number | null = null;

  closeChatbot() {
    this.close.emit();
  }

  // Métodos drag and drop
  onDragStart(event: MouseEvent) {
    this.dragging = true;
    const container = (event.target as HTMLElement).closest(
      '.chatbot-container'
    ) as HTMLElement;
    const rect = container.getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    event.preventDefault();
  }

  onDragMove(event: MouseEvent) {
    if (!this.dragging) return;
    this.chatbotPosition = {
      x: event.clientX - this.dragOffset.x,
      y: event.clientY - this.dragOffset.y,
    };
  }

  onDragEnd() {
    this.dragging = false;
  }

  ngOnInit() {
    window.addEventListener('mousemove', this.onDragMove.bind(this));
    window.addEventListener('mouseup', this.onDragEnd.bind(this));
    this.authService.getUserRole().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
      },
      error: () => {
        this.currentUserId = null;
      },
    });
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.onDragMove.bind(this));
    window.removeEventListener('mouseup', this.onDragEnd.bind(this));
  }
  constructor(
    private chatbotService: ChatbotService,
    private taskAssignationService: TaskAssignationService,
    private authService: AuthService
  ) {}

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({ from: 'user', text: this.userInput });
    this.loading = true;
    const userId = this.currentUserId;
    if (!userId) {
      this.messages.push({ from: 'bot', text: 'No user en sesión.' });
      this.loading = false;
      return;
    }
    this.chatbotService
      .askAboutTasks({ userId, message: this.userInput })
      .subscribe(
        (res: ChatbotResponse) => {
          this.messages.push({ from: 'bot', text: res.response });
          if (res.tasks && res.tasks.length > 0) {
            this.taskAssignationService
              .getTaskAssignationByUserId(userId)
              .subscribe(
                (userAssignations: TaskAssignation[]) => {
                  const tasksWithAssignation: Array<
                    TaskAssignation & { name: string }
                  > = res.tasks.map((task) => {
                    if (!task || typeof task.id === 'undefined') {
                      return {
                        id: 0,
                        user: { id: userId },
                        task: { id: task.id },
                        completed: false,
                        name: task.name,
                      };
                    }
                    const assignation = userAssignations.find(
                      (a) =>
                        a.task &&
                        typeof a.task.id !== 'undefined' &&
                        a.task.id === task.id
                    );
                    // Log para depuración
                    console.log('Assignation from backend:', assignation);
                    return {
                      id: assignation ? assignation.id : 0,
                      user: assignation ? assignation.user : { id: userId },
                      task: assignation ? assignation.task : { id: task.id },
                      completed: assignation
                        ? (assignation as any).isCompleted ??
                          assignation.completed ??
                          false
                        : false,
                      name: task.name,
                    };
                  });
                  this.messages.push({
                    from: 'bot',
                    text: 'Related tasks:',
                    tasks: tasksWithAssignation,
                  });
                  this.loading = false;
                },
                () => {
                  const tasksWithAssignation: Array<
                    TaskAssignation & { name: string }
                  > = res.tasks.map((task) => ({
                    id: 0,
                    user: { id: userId },
                    task: { id: task.id },
                    completed: false,
                    name: task.name,
                  }));
                  this.messages.push({
                    from: 'bot',
                    text: 'Related tasks:',
                    tasks: tasksWithAssignation,
                  });
                  this.loading = false;
                }
              );
          } else {
            this.loading = false;
          }
        },
        (err) => {
          this.messages.push({
            from: 'bot',
            text: 'Error connecting to assistant.',
          });
          this.loading = false;
        }
      );
    this.userInput = '';
  }
}
