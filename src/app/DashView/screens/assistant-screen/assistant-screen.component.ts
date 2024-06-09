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
  styleUrls: ['./assistant-screen.component.css'],
})
export class AssistantScreenComponent implements AfterViewInit {
  @ViewChild('chatHistory') chatHistory!: ElementRef;

  messagesArray: { text: string; from: string; hour: string }[] = [];
  messageInput: string = '';
  username: string = '';
  chatContent: boolean = true;
  isTyping: boolean = false;
  typingSpeed: number = 25;

  userStorage: any;
  userFirstName: any;

  constructor(
    private chatService: ChatbotService,
    private storageService: StorageService
  ) {
    this.userStorage = storageService.getUser().fullUserName;
    this.userFirstName = this.userStorage.split(' ')[0];
    this.chatService.receiveMessages().subscribe((message) => {
      this.processReceivedMessage(message);
      this.scrollToBottom();
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  getUser() {
    this.storageService.getUser().fullUserName;
    return this.userStorage.split(' ')[0];
  }

  scrollToBottom(): void {
    try {
      const chatHistory = this.chatHistory;
      if (chatHistory) {
        chatHistory.nativeElement.scrollTop =
          chatHistory.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error', err);
    }
  }

  sendMessageRequest(): void {
    this.messagesArray.push({
      text: this.messageInput,
      from: this.userFirstName,
      hour: this.getCurrentDate(),
    });
    console.log(this.messagesArray);
    this.chatService.sendMessage(this.messageInput);
    this.messageInput = '';
    this.scrollToBottom();
  }

  getCurrentDate() {
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    return `${hour}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  processReceivedMessage(message: string) {
    const lastMessage = this.messagesArray[this.messagesArray.length - 1];
    const botName = 'Koios';
    const timestamp = this.getCurrentDate();

    let newMessage = '';

    if (lastMessage && lastMessage.from === botName) {
      newMessage = lastMessage.text + ' ' + message;
      lastMessage.hour = timestamp; // Atualizar a hora para a mais recente
    } else {
      // Se não, é uma nova mensagem do bot
      newMessage = message;
      this.messagesArray.push({
        text: newMessage,
        from: botName,
        hour: timestamp,
      });
    }

    this.isTyping = true;
    const typingTimer = setInterval(() => {
      if (newMessage.length > 0) {
        this.messagesArray[this.messagesArray.length - 1].text +=
          newMessage.charAt(0);
        newMessage = newMessage.substring(1);
      } else {
        clearInterval(typingTimer);
        this.isTyping = false;
      }
    }, this.typingSpeed);
  }
}
