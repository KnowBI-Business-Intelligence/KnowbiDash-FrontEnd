import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChatbotService } from '../../../core/services/chatbot/chatbot.service';
import { StorageService } from '../../../core/services/user/storage.service';

@Component({
  selector: 'app-assistant-screen',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, CommonModule, MatDivider],
  templateUrl: './assistant-screen.component.html',
  styleUrl: './assistant-screen.component.css',
})
export class AssistantScreenComponent implements AfterViewInit {
  @ViewChild('chatHistory') chatHistory!: ElementRef;

  messagesArray: { text: string; from: string; hour: string }[] = [];
  messageInput: string = '';
  chatContent: boolean = false;

  userStorage: any;
  userFirstName: any;

  constructor(
    private chatService: ChatbotService,
    private storageService: StorageService
  ) {
    this.userStorage = storageService.getUser().fullUserName;
    this.userFirstName = this.userStorage.split(' ')[0];
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  getUser() {
    this.storageService.getUser().fullUserName;
    return this.userStorage.split(' ')[0];
  }

  getCurrentDate() {
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    return `${hour}:${minutes}`;
  }

  scrollToBottom(): void {
    try {
      const chatHistory = this.chatHistory;
      if (chatHistory) {
        chatHistory.nativeElement.scrollTop =
          chatHistory.nativeElement.scrollHeight;
      }
    } catch (err) {
      ('');
      console.error('Erro ao rolar para baixo:', err);
    }
  }

  sendMessageRequest(): void {
    this.scrollToBottom();
    const self = this;

    this.messagesArray.push({
      text: this.messageInput,
      from: this.userFirstName,
      hour: this.getCurrentDate(),
    });

    this.chatService.sendMessage(this.messageInput).subscribe({
      next: (value: any) => {
        console.log(value);

        self.chatContent = true;
        self.messagesArray.push({
          text: value[0].text,
          from: 'Koios',
          hour: self.getCurrentDate(),
        });

        self.scrollToBottom();

        self.messageInput = '';
      },
      error(err: any) {
        console.error('Erro ao enviar mensagem:', err);
      },
    });
    self.scrollToBottom();

    this.messageInput = '';
  }
}
