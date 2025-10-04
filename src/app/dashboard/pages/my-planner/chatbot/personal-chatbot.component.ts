import { Component, Output, EventEmitter } from '@angular/core';
import { ChatbotService } from 'src/app/services/chatbot.service';
import { AuthService } from 'src/app/services/auth.service';
import { TaskAssignationService } from 'src/app/services/task-assignation.service';
import { BucketService } from 'src/app/services/bucket.service';
import { ActivatedRoute } from '@angular/router';
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
  private boardId: number | null = null;
  // Drag and drop
  dragging = false;
  dragOffset = { x: 0, y: 0 };
  chatbotPosition = { x: null as number | null, y: null as number | null };
  @Output() close = new EventEmitter<void>();
  messages: Array<{
    from: 'user' | 'bot';
    text: string;
    tasks?: Array<TaskAssignation & { name: string }>;
    personalTasks?: any[];
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
    // Obtener boardId desde la URL
    this.route.parent?.params.subscribe({
      next: (params) => {
        if (params['id']) {
          this.boardId = +params['id'];
        }
      },
    });
    // Fallback si no está en parent
    this.route.params.subscribe({
      next: (params) => {
        if (params['id']) {
          this.boardId = +params['id'];
        }
      },
    });
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
    private authService: AuthService,
    private bucketService: BucketService,
    private route: ActivatedRoute
  ) {}

  // Estado para flujo conversacional
  private awaitingAcceptRecommended = false;
  private recommendedPersonalTasks: any[] = [];
  private awaitingBucketSelection = false;
  private bucketOptions: any[] = [];
  private selectedBucketId: number | null = null;

  sendMessage() {
    if (!this.userInput.trim()) return;
  this.messages.push({ from: 'user', text: this.userInput });
    this.loading = true;
    const userId = this.currentUserId;
    if (!userId) {
      this.messages.push({ from: 'bot', text: 'No user in session.' });
      this.loading = false;
      return;
    }

    // Si está esperando aceptación de tareas recomendadas
    if (this.awaitingAcceptRecommended) {
      const input = this.userInput.trim().toLowerCase();
      if (input === 'sí' || input === 'si' || input === 'yes') {
        // Preguntar por bucket
        this.awaitingAcceptRecommended = false;
        this.awaitingBucketSelection = true;
        // Obtener buckets del board y filtrar por usuario
        if (!this.boardId) {
          this.messages.push({ from: 'bot', text: 'No se pudo obtener el board.' });
          this.loading = false;
          this.userInput = '';
          return;
        }
        this.bucketService.getBucketsByBoard(this.boardId).subscribe({
          next: (buckets: any[]) => {
            // Si los buckets tienen userId, filtrar por el usuario actual
            const filteredBuckets = buckets.filter(b => !b.userId || b.userId === userId);
            this.bucketOptions = filteredBuckets;
            if (filteredBuckets.length === 0) {
              this.messages.push({ from: 'bot', text: 'No tienes buckets disponibles en este board. Crea uno primero.' });
              this.loading = false;
              this.userInput = '';
              return;
            }
            let bucketList = filteredBuckets.map(b => `- ${b.name}`).join('\n');
            this.messages.push({ from: 'bot', text: `¿En qué bucket quieres guardar las tareas?\n${bucketList}` });
            this.loading = false;
            this.userInput = '';
          },
          error: () => {
            this.messages.push({ from: 'bot', text: 'Error obteniendo buckets del board.' });
            this.loading = false;
            this.userInput = '';
          }
        });
        return;
      } else {
        this.messages.push({ from: 'bot', text: 'Tareas recomendadas descartadas.' });
        this.awaitingAcceptRecommended = false;
        this.loading = false;
        this.userInput = '';
        return;
      }
    }

    // Si está esperando selección de bucket
    if (this.awaitingBucketSelection) {
      const bucketName = this.userInput.trim();
      const bucket = this.bucketOptions.find(b => b.name.toLowerCase() === bucketName.toLowerCase());
      if (!bucket) {
        this.messages.push({ from: 'bot', text: 'Bucket no encontrado. Escribe el nombre exacto.' });
        this.loading = false;
        this.userInput = '';
        return;
      }
      this.selectedBucketId = bucket.id;
      this.awaitingBucketSelection = false;
      // Guardar cada tarea recomendada
      const now = new Date();
      const createdAt = now.toISOString().split('T')[0];
      const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      let saveCount = 0;
      let saveErrors = 0;
      this.recommendedPersonalTasks.forEach((task) => {
        const newTask = {
          title: task.title,
          description: task.description,
          userId: userId,
          bucketId: this.selectedBucketId,
          createdAt: createdAt,
          dueDate: dueDate,
          completed: false
        };
        this.taskAssignationService.createPersonalTask(newTask).subscribe({
          next: () => {
            saveCount++;
            if (saveCount + saveErrors === this.recommendedPersonalTasks.length) {
              this.messages.push({ from: 'bot', text: `Tareas guardadas en el bucket '${bucket.name}'.` });
              this.loading = false;
              this.userInput = '';
            }
          },
          error: () => {
            saveErrors++;
            if (saveCount + saveErrors === this.recommendedPersonalTasks.length) {
              this.messages.push({ from: 'bot', text: `Algunas tareas no se pudieron guardar.` });
              this.loading = false;
              this.userInput = '';
            }
          }
        });
      });
      return;
    }

    // Flujo normal: pedir recomendaciones
    this.chatbotService
      .getRecommendedTasks({ userId, message: this.userInput })
      .subscribe(
        (res: any) => {
          // Renderizar tareas personales recomendadas
          if (res.personalTasks && res.personalTasks.length > 0) {
            this.recommendedPersonalTasks = res.personalTasks;
            // Mostrar cards de tareas personales recomendadas
            this.messages.push({
              from: 'bot',
              text: res.response || 'Tareas personales recomendadas:',
              personalTasks: res.personalTasks
            });
            // Preguntar si está de acuerdo
            this.messages.push({ from: 'bot', text: '¿Estás de acuerdo con las tareas personales recomendadas? (Responde sí/no)' });
            this.awaitingAcceptRecommended = true;
          } else {
            this.messages.push({ from: 'bot', text: res.response || 'No se encontraron tareas recomendadas.' });
          }
          this.loading = false;
          this.userInput = '';
        },
        (err: any) => {
          this.messages.push({ from: 'bot', text: 'Error conectando con el asistente.' });
          this.loading = false;
          this.userInput = '';
        }
      );
  }
}
