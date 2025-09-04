import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenerarChatService } from './generar-chat.service';
import { HttpClientModule } from '@angular/common/http';
import { GenerarChatModule } from './generar-chat.module';
import { CommonModule } from '@angular/common';
import { AccessibilityMenuComponent } from '../../shared/accessibility-menu/accessibility-menu.component';
import { Router, RouterModule } from '@angular/router';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  isExercise?: boolean;  // Nuevo campo para identificar si el mensaje es un ejercicio
  exerciseName?: string; // Nombre del ejercicio si aplica
}

@Component({
  selector: 'app-generar-chat',
  standalone: true,
  imports: [FormsModule, GenerarChatModule, CommonModule, AccessibilityMenuComponent, RouterModule],
  templateUrl: './generar-chat.component.html',
  styleUrls: ['./generar-chat.component.css']
})
export class GenerarChatComponent implements OnInit {
  prompt = '';
  messages: Message[] = [
    { sender: 'bot', text: 'Hola, soy Emonical! ¿En qué puedo ayudarte?' }
  ];

  private detectedEmotion: string | null = null;

  constructor(private generarChatService: GenerarChatService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.prompt.trim()) {
      // Agregar mensaje del usuario al array de mensajes
      this.messages.push({ sender: 'user', text: this.prompt });

      // Detectar emoción en el mensaje del usuario
      this.detectedEmotion = this.detectEmotion(this.prompt);

      // Llamar al servicio para obtener la respuesta del bot
      this.generarChatService.getContent(this.prompt).subscribe(
        data => {
          const botMessage: Message = { sender: 'bot', text: data.content };

          // Verificar si la respuesta contiene una recomendación de ejercicio
          if (data.content.includes('Te recomiendo realizar el siguiente ejercicio en realidad aumentada')) {
            botMessage.isExercise = true;
            botMessage.exerciseName = this.extractExerciseName(data.content);
          }

          // Agregar respuesta del bot al array de mensajes
          this.messages.push(botMessage);
        },
        err => {
          // Manejar el error y mostrarlo en el chat
          this.messages.push({ sender: 'bot', text: 'Error: No se pudo obtener respuesta' });
        }
      );

      // Limpiar el campo de entrada
      this.prompt = '';
    }
  }

  // Función para extraer el nombre del ejercicio del mensaje
  private extractExerciseName(content: string): string {
    const match = content.match(/Te recomiendo realizar el siguiente ejercicio en realidad aumentada para calmarte: (.+)\./);
    return match ? match[1] : 'Ejercicio';
  }

  // Detecta palabras clave para identificar emociones
  private detectEmotion(text: string): string | null {
    const lower = text.toLowerCase();
    const sadness = ['triste', 'tristeza', 'deprimido', 'depresión', 'depresion'];
    const anxiety = ['ansiedad', 'ansioso', 'ansiosa', 'miedo'];
    const stress = ['estrés', 'estres', 'estresado', 'estresada', 'agobiado', 'agobiada'];

    if (sadness.some(w => lower.includes(w))) {
      return 'tristeza';
    }
    if (anxiety.some(w => lower.includes(w))) {
      return 'ansiedad';
    }
    if (stress.some(w => lower.includes(w))) {
      return 'estres';
    }
    return null;
  }

  // Función para abrir el componente de AR
  openAR(exerciseName: string): void {
    const emotion = this.detectedEmotion || 'ansiedad';
    this.router.navigate(['/ar-viewer'], { queryParams: { exercise: exerciseName, emotion } });
  }
}
