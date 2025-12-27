import { Classroom, NavItem, NewsItem, Material, User, ScheduleItem, ContactMessage } from './types';
import { Users, BookOpen, GraduationCap, Calendar } from 'lucide-react';

// Substitua esta URL pela URL da sua imagem de logo real
export const LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzgY9WNPNg35kB89I-eym5yyksrQuIB1suFJxHsyK5HLBwZnuN_lSj5bc&s=10";

export const SCHOOL_NAME = "EBD Conectada";
export const CHURCH_NAME = "Igreja Evangélica Congregacional da Liberdade";

export const NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Início', href: '#inicio' },
  { label: 'Turmas', href: '#turmas' },
  { label: 'Notícias & Eventos', href: '#noticias' },
  { label: 'Contato', href: '#contato' },
];

export const MOCK_USERS: User[] = [
  {
    id: 'admin',
    name: 'Administrador',
    email: 'admin@iecl.com',
    role: 'admin',
    status: 'active',
    joinedDate: '2023-01-01'
  },
  {
    id: 'u1',
    name: 'João Silva',
    email: 'aluno@teste.com',
    password: '123',
    birthDate: '1995-05-10',
    role: 'student',
    status: 'active',
    joinedDate: '2023-10-15'
  },
  {
    id: 'u2',
    name: 'Maria Oliveira',
    email: 'maria@teste.com',
    password: '123',
    birthDate: '1998-11-20',
    role: 'student',
    status: 'pending',
    joinedDate: '2023-11-01'
  }
];

export const STATS = [
  {
    label: 'Alunos Matriculados',
    value: 121,
    icon: Users,
    color: 'bg-blue-100 text-iecl-blue',
    description: 'Crescendo na graça e conhecimento'
  },
  {
    label: 'Salas de Aula',
    value: 4,
    icon: BookOpen,
    color: 'bg-red-100 text-iecl-red',
    description: 'Classes para todas as idades'
  },
  {
    label: 'Professores',
    value: 12,
    icon: GraduationCap,
    color: 'bg-orange-100 text-orange-600',
    description: 'Dedicados ao ensino da Palavra'
  },
  {
    label: 'Anos de História',
    value: 25,
    icon: Calendar,
    color: 'bg-green-100 text-green-600',
    description: 'Formando discípulos'
  }
];

export const CLASSROOMS: Classroom[] = [
  {
    id: '1',
    name: 'Infantil',
    targetAudience: 'Até 10 anos',
    studentsCount: 0,
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=500',
    description: 'Um ambiente lúdico e acolhedor onde as crianças aprendem as primeiras e mais importantes lições da Bíblia. Focamos no amor de Deus, na criação e na vida de Jesus através de histórias, músicas e atividades manuais.',
    teachers: ['Tia Bia', 'Tia Carol', 'Aux. Júlia']
  },
  {
    id: '2',
    name: 'Juniores',
    targetAudience: '11 a 14 anos',
    studentsCount: 0,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=500',
    description: 'Nesta fase de transição, fortalecemos as bases do conhecimento bíblico e o caráter cristão. Abordamos heróis da fé, panorama bíblico e como aplicar a Palavra na escola e na família.',
    teachers: ['Prof. Carlos', 'Prof. Roberto']
  },
  {
    id: '3',
    name: 'Jovens',
    targetAudience: '15 a 25 anos',
    studentsCount: 0,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=500',
    description: 'Discutimos os desafios da juventude, identidade, namoro, carreira e propósito de vida, sempre à luz inerrante das Escrituras. Um espaço para perguntas difíceis e respostas bíblicas.',
    teachers: ['Pr. Marcos', 'Sem. Felipe']
  },
  {
    id: '4',
    name: 'Adultos',
    targetAudience: 'Acima de 26 anos',
    studentsCount: 0,
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=500',
    description: 'Estudo aprofundado de livros da Bíblia, teologia sistemática e doutrinas essenciais. O objetivo é o amadurecimento espiritual e a aplicação prática para a vida cristã, família e sociedade.',
    teachers: ['Pb. João', 'Dc. Antônio', 'Prof. Maria Helena']
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: '2026-salvacao',
    title: 'Escola Bíblica Dominical 2026',
    excerpt: 'Convite especial: Um ano dedicado ao estudo da Doutrina da Salvação. Venha aprender sobre a maior obra de Deus!',
    content: 'Com alegria anunciamos o tema do nosso ano letivo de 2026: A Doutrina da Salvação. Durante este ano, mergulharemos nas Escrituras para compreender a magnitude da obra redentora de Cristo. Abordaremos temas fundamentais como a graça, a justificação, a regeneração e a santificação. Convidamos você e sua família para estarem conosco todos os domingos, às 09:30h. Será um tempo precioso de crescimento espiritual e comunhão. Traga sua Bíblia e um coração sedento por Deus!',
    date: 'Janeiro 2026',
    category: 'Evento',
    location: 'Igreja Evangélica Congregacional da Liberdade',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=1000'
  }
];

export const MEMBER_MATERIALS: Material[] = [
  {
    id: '1',
    title: 'Lição 01 - A Criação',
    type: 'PDF',
    url: '#',
    description: 'Material de apoio para a aula sobre Gênesis 1 e 2.',
    date: '05 Nov 2023'
  },
  {
    id: '2',
    title: 'Aula Gravada - A Queda',
    type: 'Vídeo',
    url: '#',
    description: 'Gravação da aula ministrada pelo Pr. Marcos.',
    date: '12 Nov 2023'
  },
  {
    id: '3',
    title: 'Exercícios de Fixação',
    type: 'PDF',
    url: '#',
    description: 'Lista de exercícios para revisão do conteúdo mensal.',
    date: '15 Nov 2023'
  },
  {
    id: '4',
    title: 'Mapa Mental - Êxodo',
    type: 'PDF',
    url: '#',
    description: 'Resumo visual da jornada do povo de Israel.',
    date: '19 Nov 2023'
  }
];

export const DEFAULT_SCHEDULES: ScheduleItem[] = [
  { id: '1', day: 'Domingo', title: 'EBD', time: '09:30 - 11:30', color: 'red' },
  { id: '2', day: 'Domingo', title: 'Culto de Adoração', time: '18:00 - 20:00', color: 'red' },
  { id: '3', day: 'Terça', title: 'Estudo Bíblico', time: '19:30 - 21:00', color: 'yellow' },
  { id: '4', day: 'Quinta', title: 'Oração e Testemunho', time: '19:30 - 21:00', color: 'yellow' },
  { id: '5', day: 'Sábado', title: 'Reunião de Oração', time: '08:00 - 09:00', color: 'green' },
];

export const MOCK_MESSAGES: ContactMessage[] = [
  { 
    id: '1', 
    name: 'Ana Souza', 
    email: 'ana@teste.com', 
    message: 'Gostaria de saber se tem turma para crianças de 3 anos.', 
    date: '2023-10-25', 
    read: false, 
    replied: false 
  },
  { 
    id: '2', 
    name: 'Pedro Gomes', 
    email: 'pedro@teste.com', 
    message: 'Como faço para ser professor da EBD?', 
    date: '2023-10-20', 
    read: true, 
    replied: true 
  }
];