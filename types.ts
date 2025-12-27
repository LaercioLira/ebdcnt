import React from 'react';

export interface Classroom {
  id: string;
  name: string;
  targetAudience: string;
  studentsCount: number;
  image: string;
  description: string;
  teachers: string[]; // Lista de nomes (para exibição rápida)
}

export interface Stat {
  label: string;
  value: number;
  icon: any; 
  color: string;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
  action?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'Notícia' | 'Evento';
  location?: string;
  image?: string;
  activeUntil?: string;
  featured?: boolean; // Se deve aparecer na página inicial (limite de 3)
}

export interface Material {
  id: string;
  title: string;
  type: 'PDF' | 'Vídeo' | 'Link';
  url: string;
  description?: string;
  date: string;
  forTeachers?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  birthDate?: string;
  phone?: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'pending' | 'inactive'; // Adicionado inactive
  joinedDate?: string;
  teachingClassroomId?: string; // ID da turma que o professor leciona
}

export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  title: string;
  color: 'red' | 'yellow' | 'green' | 'blue';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
  replied: boolean;
}