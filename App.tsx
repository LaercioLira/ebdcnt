import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, LogIn, LogOut, 
  Calendar, MapPin, Mail, Phone, ChevronRight, 
  User as UserIcon, LayoutDashboard, 
  FileText, Users, Trash2, Edit2, Plus, AlertCircle,
  Clock, Share2,
  GraduationCap, BookOpen,
  MessageSquare, Star,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Instagram,
  MessageCircle,
  Copy
} from 'lucide-react';
import { SCHOOL_NAME, CHURCH_NAME, NAVIGATION_ITEMS, STATS, CLASSROOMS, NEWS_ITEMS, MOCK_USERS, LOGO_URL, DEFAULT_SCHEDULES, MOCK_MESSAGES } from './constants';
import { User, Classroom, NewsItem, ScheduleItem, ContactMessage } from './types';

// Componente para rolar para âncoras
const ScrollToHashElement = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);
  return null;
};

// LocalStorage Helpers
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(`ebd_conectada_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch (e) { return fallback; }
};

const saveToStorage = (key: string, data: any) => {
  try { localStorage.setItem(`ebd_conectada_${key}`, JSON.stringify(data)); } catch (e) {}
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Estados principais
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('ebd_conectada_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('users', MOCK_USERS));
  const [news, setNews] = useState<NewsItem[]>(() => loadFromStorage('news', NEWS_ITEMS));
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => loadFromStorage('classrooms', CLASSROOMS));
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => loadFromStorage('schedules', DEFAULT_SCHEDULES));
  const [messages, setMessages] = useState<ContactMessage[]>(() => loadFromStorage('messages', MOCK_MESSAGES));

  // Persistência
  useEffect(() => { if (user) localStorage.setItem('ebd_conectada_user', JSON.stringify(user)); else localStorage.removeItem('ebd_conectada_user'); }, [user]);
  useEffect(() => saveToStorage('users', users), [users]);
  useEffect(() => saveToStorage('news', news), [news]);
  useEffect(() => saveToStorage('classrooms', classrooms), [classrooms]);
  useEffect(() => saveToStorage('schedules', schedules), [schedules]);
  useEffect(() => saveToStorage('messages', messages), [messages]);

  // Estados de Formulários Admin
  const [adminView, setAdminView] = useState<'dashboard' | 'news' | 'teachers' | 'students' | 'classrooms' | 'schedules' | 'messages'>('dashboard');
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showClassroomForm, setShowClassroomForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estados de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // Estados de dados para formulários
  const [newsFormData, setNewsFormData] = useState({ title: '', excerpt: '', content: '', category: 'Notícia' as 'Notícia' | 'Evento', image: '', featured: false, activeDays: 30 });
  const [teacherFormData, setTeacherFormData] = useState({ name: '', email: '', phone: '', status: 'active' as 'active' | 'inactive', teachingClassroomId: '' });
  const [classroomFormData, setClassroomFormData] = useState({ name: '', targetAudience: '', description: '', image: '' });
  const [scheduleFormData, setScheduleFormData] = useState({ day: 'Domingo', time: '', title: '', color: 'blue' as 'red' | 'yellow' | 'green' | 'blue' });

  // --- Autenticação ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const email = loginEmail.trim().toLowerCase();
    
    // Login Admin Fixo
    if ((email === 'admin' || email === 'admin@iecl.com') && loginPassword === 'Rebegio05@') {
      setUser({ id: 'admin', name: 'Administrador', email: 'admin@iecl.com', role: 'admin', status: 'active' });
      setShowLoginModal(false); 
      return;
    }
    
    // Login Usuários
    const found = users.find(u => u.email.toLowerCase() === email && u.password === loginPassword);
    if (found) { 
      if(found.status === 'inactive') {
        setLoginError('Conta desativada.');
      } else {
        setUser(found); 
        setShowLoginModal(false); 
      }
    } else { 
      setLoginError('Credenciais inválidas.'); 
    }
  };

  const handleLogout = () => { setUser(null); navigate('/'); };

  // --- Lógica Admin ---
  
  // Notícias
  const prepareNewsForm = (item?: NewsItem) => {
    if (item) {
      setEditingId(item.id);
      setNewsFormData({
        title: item.title, excerpt: item.excerpt, content: item.content, 
        category: item.category, image: item.image || '', featured: !!item.featured, activeDays: 30
      });
    } else {
      setEditingId(null);
      setNewsFormData({ title: '', excerpt: '', content: '', category: 'Notícia', image: '', featured: false, activeDays: 30 });
    }
    setShowNewsForm(true);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && news.length >= 20) return alert("Limite de 20 notícias.");
    if (newsFormData.featured && news.filter(n => n.featured && n.id !== editingId).length >= 3) return alert("Máximo 3 destaques.");
    
    const item: NewsItem = {
      id: editingId || Date.now().toString(),
      ...newsFormData,
      date: new Date().toLocaleDateString('pt-BR'),
      activeUntil: new Date(Date.now() + newsFormData.activeDays * 86400000).toISOString()
    };
    setNews(editingId ? news.map(n => n.id === editingId ? item : n) : [item, ...news]);
    setShowNewsForm(false);
  };

  // Professores
  const prepareTeacherForm = (item?: User) => {
    if(item) {
      setEditingId(item.id);
      setTeacherFormData({
        name: item.name, email: item.email, phone: item.phone || '', 
        status: item.status as 'active' | 'inactive', teachingClassroomId: item.teachingClassroomId || ''
      });
    } else {
      setEditingId(null);
      setTeacherFormData({ name: '', email: '', phone: '', status: 'active', teachingClassroomId: '' });
    }
    setShowTeacherForm(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const item: User = { id: editingId || Date.now().toString(), ...teacherFormData, role: 'teacher', status: teacherFormData.status };
    setUsers(editingId ? users.map(u => u.id === editingId ? item : u) : [...users, item]);
    setShowTeacherForm(false);
  };

  // Turmas
  const prepareClassroomForm = (item?: Classroom) => {
    if(item) {
      setEditingId(item.id);
      setClassroomFormData({ name: item.name, targetAudience: item.targetAudience, description: item.description, image: item.image });
    } else {
      setEditingId(null);
      setClassroomFormData({ name: '', targetAudience: '', description: '', image: '' });
    }
    setShowClassroomForm(true);
  };

  const handleSaveClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    const currentClass = editingId ? classrooms.find(c => c.id === editingId) : null;
    const item: Classroom = { 
      id: editingId || Date.now().toString(), 
      ...classroomFormData, 
      studentsCount: currentClass ? currentClass.studentsCount : 0, 
      teachers: currentClass ? currentClass.teachers : [] 
    };
    setClassrooms(editingId ? classrooms.map(c => c.id === editingId ? item : c) : [...classrooms, item]);
    setShowClassroomForm(false);
  };

  // Horários
  const prepareScheduleForm = (item?: ScheduleItem) => {
    if(item) {
      setEditingId(item.id);
      setScheduleFormData({ day: item.day, time: item.time, title: item.title, color: item.color });
    } else {
      setEditingId(null);
      setScheduleFormData({ day: 'Domingo', time: '', title: '', color: 'blue' });
    }
    setShowScheduleForm(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ScheduleItem = { id: editingId || Date.now().toString(), ...scheduleFormData };
    setSchedules(editingId ? schedules.map(s => s.id === editingId ? item : s) : [...schedules, item]);
    setShowScheduleForm(false);
  };

  // Delete genérico
  const handleDeleteItem = (id: string, type: 'news' | 'user' | 'classroom' | 'schedule' | 'message') => {
    if (!window.confirm('Tem certeza que deseja excluir?')) return;
    if (type === 'news') setNews(news.filter(n => n.id !== id));
    if (type === 'user') setUsers(users.filter(u => u.id !== id));
    if (type === 'classroom') setClassrooms(classrooms.filter(c => c.id !== id));
    if (type === 'schedule') setSchedules(schedules.filter(s => s.id !== id));
    if (type === 'message') setMessages(messages.filter(m => m.id !== id));
  };

  const isExpired = (date?: string) => date ? new Date(date) < new Date() : false;

  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      if (location.pathname !== '/') navigate('/');
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else navigate(href);
  };

  const handleCopyLink = (newsItem: NewsItem) => {
    const text = `*Convite Especial - ${CHURCH_NAME}*\n\n*${newsItem.title}*\n\n${newsItem.excerpt}\n\nVenha participar conosco!\nRua Martins Júnior, 841 - Liberdade\nDomingos às 09:30hs`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess('Convite copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  // --- Sub-páginas ---
  const HomePage = () => {
    const featured = news.filter(n => n.featured && !isExpired(n.activeUntil)).slice(0, 3);
    return (
      <>
        <section id="inicio" className="relative py-24 md:py-36 bg-iecl-blue text-white overflow-hidden scroll-mt-20">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/20">{CHURCH_NAME}</span>
            <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-none animate-fade-up">Crescendo na Graça <br/>e no Conhecimento <br/>do <span className="text-iecl-red">Senhor Jesus</span></h1>
            <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 font-medium">Todos os domingos às 09:30hs. <br/>Uma jornada de fé para toda a família.</p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button onClick={() => navigate('/turmas')} className="px-10 py-5 bg-iecl-red hover:bg-red-700 font-black rounded-2xl shadow-xl transition-all hover:-translate-y-1">Nossas Turmas</button>
              <button onClick={() => setShowLoginModal(true)} className="px-10 py-5 bg-white/10 hover:bg-white/20 font-black rounded-2xl border border-white/20 backdrop-blur-md">Portal do Aluno</button>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white relative z-20 -mt-12 mb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map(s => (
                <div key={s.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                  <div className={`p-4 rounded-2xl ${s.color} bg-opacity-10`}><s.icon size={24}/></div>
                  <div><h3 className="text-2xl font-black text-slate-800">{s.value}</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="turmas" className="py-24 bg-slate-50 scroll-mt-20">
          <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="text-4xl font-black text-iecl-blue mb-4">Aprendizado para Todos</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">Dividimos nossas classes para que cada idade receba o ensino de forma adequada e profunda.</p>
          </div>
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {classrooms.slice(0, 4).map(c => (
              <div key={c.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 group">
                <div className="h-48 overflow-hidden"><img src={c.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={c.name} /></div>
                <div className="p-8"><h3 className="font-black text-xl mb-1">{c.name}</h3><p className="text-[10px] font-black text-iecl-red uppercase tracking-widest mb-4">{c.targetAudience}</p><button onClick={() => navigate('/turmas')} className="text-iecl-blue font-black text-xs flex items-center gap-2 hover:gap-3 transition-all">Saber mais <ArrowRight size={14}/></button></div>
              </div>
            ))}
          </div>
        </section>

        <section id="noticias" className="py-24 bg-white scroll-mt-20">
          <div className="container mx-auto px-4 flex justify-between items-end mb-12">
            <div><h2 className="text-4xl font-black text-iecl-blue mb-2">Mural de Avisos</h2><p className="text-slate-500 font-medium">Fique por dentro do que acontece na nossa EBD.</p></div>
            <button onClick={() => navigate('/noticias')} className="hidden md:flex items-center gap-2 text-iecl-red font-black hover:underline">Ver todo o mural <ChevronRight size={18}/></button>
          </div>
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
            {featured.map(n => (
              <article key={n.id} className="bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 flex flex-col group cursor-pointer" onClick={() => setSelectedNews(n)}>
                <div className="h-56 bg-slate-200 overflow-hidden relative">
                  {n.image && <img src={n.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={n.title}/>}
                  <span className="absolute top-4 left-4 bg-iecl-blue/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">{n.category}</span>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-xs font-bold text-slate-400 mb-2">{n.date}</span>
                  <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-iecl-blue transition-colors leading-tight">{n.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed">{n.excerpt}</p>
                  <div className="mt-auto pt-6 border-t border-slate-200 flex items-center gap-2 text-iecl-blue font-black text-sm uppercase tracking-widest">Ler aviso completo</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-iecl-blue mb-4">Programação Semanal</h2>
              <p className="text-slate-500 font-medium max-w-xl mx-auto">Participe dos nossos cultos e atividades. Um lugar para você e sua família.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {schedules.map(s => (
                <div key={s.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center text-center">
                   <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-colors ${s.color === 'red' ? 'bg-red-50 text-iecl-red' : s.color === 'yellow' ? 'bg-orange-50 text-orange-500' : s.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-iecl-blue'}`}>
                      <Clock size={28} />
                   </div>
                   <h3 className="text-lg font-black text-slate-800 mb-2">{s.day}</h3>
                   <div className="w-10 h-1 bg-slate-100 rounded-full mb-4"></div>
                   <p className="text-base font-bold text-slate-600 mb-1 leading-tight">{s.title}</p>
                   <p className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full mt-2">{s.time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="py-24 bg-iecl-blue text-white scroll-mt-20">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">Ficou com alguma dúvida?</h2>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed">Nossa equipe está pronta para te receber e tirar todas as suas dúvidas sobre matrículas, classes e horários.</p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl"><MapPin size={20}/></div>
                  <p className="font-bold">Rua Martins Júnior, 841 - Liberdade</p>
                </div>
                {/* Instagram Link Added Here */}
                <a href="https://instagram.com/iec_liberdade" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                  <div className="p-3 bg-white/10 rounded-xl"><Instagram size={20}/></div>
                  <p className="font-bold">@iec_liberdade</p>
                </a>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] text-slate-800 shadow-2xl">
              <h3 className="text-2xl font-black mb-6 text-iecl-blue">Mande uma mensagem</h3>
              <form className="space-y-4">
                <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-iecl-blue font-bold" placeholder="Seu nome" />
                <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-iecl-blue font-bold" placeholder="E-mail" />
                <textarea className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-iecl-blue h-32 font-bold resize-none" placeholder="Sua mensagem" />
                <button className="w-full py-5 bg-iecl-red text-white font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-red-900/20 active:scale-95 transition-all">Enviar Mensagem</button>
              </form>
            </div>
          </div>
        </section>
      </>
    );
  };

  const AdminPanel = () => (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <aside className="w-72 bg-iecl-blue text-white hidden lg:flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-blue-900 flex items-center gap-3">
          <img src={LOGO_URL} className="w-10 h-10 rounded-xl bg-white p-1 object-contain" alt="Logo" />
          <div className="leading-none">
            <h2 className="font-black text-lg tracking-tighter">Admin Panel</h2>
            <p className="text-[10px] uppercase font-bold text-blue-400 tracking-widest mt-1">EBD Conectada</p>
          </div>
        </div>
        <nav className="p-6 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {[
            {id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard'},
            {id: 'news', icon: FileText, label: 'Notícias & Mural'},
            {id: 'teachers', icon: GraduationCap, label: 'Professores'},
            {id: 'students', icon: Users, label: 'Alunos'},
            {id: 'classrooms', icon: BookOpen, label: 'Turmas'},
            {id: 'schedules', icon: Clock, label: 'Agenda Geral'},
            {id: 'messages', icon: MessageSquare, label: 'Mensagens Site'}
          ].map(item => (
            <button key={item.id} onClick={() => setAdminView(item.id as any)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold ${adminView === item.id ? 'bg-white/10 shadow-lg text-white' : 'text-blue-300 hover:bg-white/5'}`}>
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-blue-900">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 text-red-400 hover:text-red-300 font-bold transition-all bg-red-500/5 rounded-2xl"><LogOut size={20} /> Sair do Sistema</button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto pb-20">
        <header className="bg-white border-b border-slate-200 px-10 py-6 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-800 capitalize tracking-tighter">{adminView === 'dashboard' ? 'Visão Geral' : adminView}</h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-iecl-blue flex items-center justify-center font-black">AD</div>
          </div>
        </header>

        <div className="p-10">
          {adminView === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
                <div className="p-3 bg-blue-50 text-iecl-blue w-fit rounded-xl mb-4"><Users/></div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Alunos</h4>
                <p className="text-4xl font-black text-slate-800">{users.filter(u => u.role === 'student').length}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
                <div className="p-3 bg-green-50 text-green-600 w-fit rounded-xl mb-4"><FileText/></div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Notícias</h4>
                <p className="text-4xl font-black text-slate-800">{news.length}/20</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
                <div className="p-3 bg-orange-50 text-orange-600 w-fit rounded-xl mb-4"><GraduationCap/></div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Equipe</h4>
                <p className="text-4xl font-black text-slate-800">{users.filter(u => u.role === 'teacher').length}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
                <div className="p-3 bg-purple-50 text-purple-600 w-fit rounded-xl mb-4"><MessageSquare/></div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Mensagens</h4>
                <p className="text-4xl font-black text-slate-800">{messages.filter(m => !m.read).length}</p>
              </div>
            </div>
          )}

          {adminView === 'news' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 font-medium">Controle do mural e avisos.</p>
                <button onClick={() => prepareNewsForm()} className="px-6 py-3 bg-iecl-blue text-white rounded-2xl font-black flex items-center gap-2 shadow-lg"><Plus size={18}/> Novo Aviso</button>
              </div>
              <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b"><tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest"><th className="p-6">Aviso</th><th className="p-6">Imagem</th><th className="p-6">Home</th><th className="p-6">Expira</th><th className="p-6 text-right">Ações</th></tr></thead>
                  <tbody className="divide-y">
                    {news.map(n => (
                      <tr key={n.id} className="hover:bg-slate-50 transition-all">
                        <td className="p-6 font-black text-slate-800">{n.title}</td>
                        <td className="p-6">{n.image ? <img src={n.image} className="w-12 h-10 object-cover rounded-lg border"/> : <ImageIcon className="text-slate-200"/>}</td>
                        <td className="p-6">{n.featured ? <Star size={18} className="text-yellow-500 fill-yellow-500" /> : "-"}</td>
                        <td className="p-6">{isExpired(n.activeUntil) ? <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">Exp</span> : <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">Ativo</span>}</td>
                        <td className="p-6 text-right space-x-2">
                          <button onClick={() => prepareNewsForm(n)} className="p-2 text-slate-400 hover:text-iecl-blue"><Edit2 size={16}/></button>
                          <button onClick={() => handleDeleteItem(n.id, 'news')} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminView === 'teachers' && (
             <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 font-medium">Equipe de professores da EBD.</p>
                <button onClick={() => prepareTeacherForm()} className="px-6 py-3 bg-iecl-blue text-white rounded-2xl font-black flex items-center gap-2"><Plus size={18}/> Novo Professor</button>
              </div>
              <div className="bg-white rounded-[2rem] border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b font-black text-[10px] uppercase text-slate-400 tracking-widest"><th className="p-6">Nome</th><th className="p-6">Classe</th><th className="p-6">Status</th><th className="p-6 text-right">Ações</th></thead>
                  <tbody className="divide-y">
                    {users.filter(u => u.role === 'teacher').map(t => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="p-6 font-black text-slate-800">{t.name}</td>
                        <td className="p-6 text-slate-500 font-bold">{classrooms.find(c => c.id === t.teachingClassroomId)?.name || "Nenhuma"}</td>
                        <td className="p-6"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${t.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{t.status}</span></td>
                        <td className="p-6 text-right space-x-2">
                          <button onClick={() => prepareTeacherForm(t)} className="p-2 text-slate-400 hover:text-iecl-blue"><Edit2 size={16}/></button>
                          <button onClick={() => handleDeleteItem(t.id, 'user')} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
             </div>
          )}

          {adminView === 'students' && (
             <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 font-medium">Alunos matriculados no sistema.</p>
              </div>
              <div className="bg-white rounded-[2rem] border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b font-black text-[10px] uppercase text-slate-400 tracking-widest"><th className="p-6">Nome</th><th className="p-6">Email</th><th className="p-6">Entrou em</th><th className="p-6 text-right">Ações</th></thead>
                  <tbody className="divide-y">
                    {users.filter(u => u.role === 'student').map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-6 font-black text-slate-800">{s.name}</td>
                        <td className="p-6 text-slate-500">{s.email}</td>
                        <td className="p-6 text-slate-400 text-sm">{s.joinedDate || '-'}</td>
                        <td className="p-6 text-right space-x-2">
                          <button onClick={() => handleDeleteItem(s.id, 'user')} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
             </div>
          )}

          {adminView === 'classrooms' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 font-medium">Gerenciamento das salas.</p>
                <button onClick={() => prepareClassroomForm()} className="px-6 py-3 bg-iecl-blue text-white rounded-2xl font-black flex items-center gap-2"><Plus size={18}/> Nova Turma</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {classrooms.map(c => (
                  <div key={c.id} className="bg-white rounded-[2rem] border p-8 flex gap-6 group hover:shadow-xl transition-all">
                     <img src={c.image} className="w-24 h-24 rounded-2xl object-cover border" />
                     <div className="flex-1">
                       <div className="flex justify-between items-start mb-2">
                         <h4 className="font-black text-lg text-slate-800">{c.name}</h4>
                         <div className="flex gap-2">
                           <button onClick={() => prepareClassroomForm(c)} className="p-2 text-slate-400 hover:text-iecl-blue"><Edit2 size={16} /></button>
                           <button onClick={() => handleDeleteItem(c.id, 'classroom')} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                         </div>
                       </div>
                       <p className="text-xs font-bold text-iecl-red mb-3 uppercase tracking-widest">{c.targetAudience}</p>
                       <p className="text-sm text-slate-500 line-clamp-2">{c.description}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminView === 'schedules' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 font-medium">Programação semanal.</p>
                <button onClick={() => prepareScheduleForm()} className="px-6 py-3 bg-iecl-blue text-white rounded-2xl font-black flex items-center gap-2"><Plus size={18}/> Novo Horário</button>
              </div>
              <div className="bg-white rounded-[2rem] border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b font-black text-[10px] uppercase text-slate-400 tracking-widest"><th className="p-6">Dia</th><th className="p-6">Hora</th><th className="p-6">Atividade</th><th className="p-6 text-right">Ações</th></thead>
                  <tbody className="divide-y">
                    {schedules.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-6 font-black text-iecl-blue">{s.day}</td>
                        <td className="p-6 text-slate-500 font-bold">{s.time}</td>
                        <td className="p-6 font-bold text-slate-800">{s.title}</td>
                        <td className="p-6 text-right space-x-2">
                          <button onClick={() => prepareScheduleForm(s)} className="p-2 text-slate-400 hover:text-iecl-blue"><Edit2 size={16}/></button>
                          <button onClick={() => handleDeleteItem(s.id, 'schedule')} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminView === 'messages' && (
            <div className="space-y-6">
              <h3 className="text-slate-500 font-medium">Fale Conosco - Mensagens</h3>
              <div className="grid grid-cols-1 gap-6">
                {messages.map(m => (
                  <div key={m.id} className={`p-8 rounded-[2rem] border transition-all ${m.read ? 'bg-white opacity-60' : 'bg-white shadow-lg border-blue-100'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-lg text-slate-800">{m.name}</h4>
                        <p className="text-xs font-bold text-slate-400">{m.email} • {m.date}</p>
                      </div>
                      <button onClick={() => handleDeleteItem(m.id, 'message')} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">{m.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-x-hidden">
      <ScrollToHashElement />
      {user?.role === 'admin' ? <AdminPanel /> : (
        <>
          <nav className="sticky top-0 z-[100] bg-white/95 backdrop-blur-xl border-b h-24 flex items-center">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                <img src={LOGO_URL} className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border" />
                <div className="flex flex-col">
                  <h1 className="font-extrabold text-iecl-blue text-2xl tracking-tight leading-none">{SCHOOL_NAME}</h1>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mt-0.5">IEC Liberdade</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-10">
                {NAVIGATION_ITEMS.map(item => (
                  <button key={item.label} onClick={() => handleNavigation(item.href)} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-iecl-red transition-all">{item.label}</button>
                ))}
                <button onClick={() => user ? handleLogout() : setShowLoginModal(true)} className="bg-iecl-blue text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-900/20 active:scale-95 transition-all">
                  {user ? 'Logout' : 'Login'}
                </button>
              </div>
              <button className="md:hidden p-3 bg-slate-50 rounded-xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X/> : <Menu/>}</button>
            </div>
            {isMobileMenuOpen && (
              <div className="absolute top-24 left-0 w-full bg-white border-b p-6 flex flex-col gap-6 md:hidden shadow-2xl animate-fade-in">
                {NAVIGATION_ITEMS.map(item => (
                  <button key={item.label} onClick={() => handleNavigation(item.href)} className="text-left font-black uppercase tracking-widest">{item.label}</button>
                ))}
                <button onClick={() => { setIsMobileMenuOpen(false); setShowLoginModal(true); }} className="w-full bg-iecl-blue text-white py-4 rounded-xl font-black uppercase">Entrar</button>
              </div>
            )}
          </nav>

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/turmas" element={<div className="py-24 container mx-auto px-4"><h1 className="text-5xl font-black text-center mb-16 tracking-tighter">Conheça Nossas Classes</h1><div className="grid grid-cols-1 md:grid-cols-2 gap-10">{classrooms.map(c => <div key={c.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center"><img src={c.image} className="w-full md:w-56 h-56 object-cover rounded-3xl" /><div className="flex-1 text-center md:text-left"><span className="text-[10px] font-black text-iecl-red uppercase tracking-widest mb-4 inline-block">{c.targetAudience}</span><h3 className="text-3xl font-black text-slate-800 mb-4">{c.name}</h3><p className="text-slate-500 font-medium leading-relaxed">{c.description}</p></div></div>)}</div></div>} />
              <Route path="/noticias" element={<div className="py-24 container mx-auto px-4"><h1 className="text-5xl font-black text-center mb-16 tracking-tighter">Mural Completo</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-10">{news.map(n => <article key={n.id} onClick={() => setSelectedNews(n)} className="bg-white rounded-[2.5rem] border overflow-hidden hover:shadow-2xl transition-all cursor-pointer"><div className="h-64 overflow-hidden relative">{n.image && <img src={n.image} className="w-full h-full object-cover"/>}</div><div className="p-8"><span className="text-xs font-bold text-slate-400 mb-2 block">{n.date}</span><h3 className="text-xl font-black text-slate-800 mb-4 leading-tight">{n.title}</h3><p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed">{n.excerpt}</p><span className="text-xs font-black text-iecl-blue uppercase tracking-widest">Ler detalhes</span></div></article>)}</div></div>} />
            </Routes>
          </main>

          <footer className="bg-slate-950 py-20 text-center border-t border-slate-900">
            <div className="container mx-auto px-4">
              <img src={LOGO_URL} className="w-12 h-12 mx-auto mb-8 grayscale opacity-50" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6">&copy; {new Date().getFullYear()} {CHURCH_NAME}</p>
              <p className="text-slate-500 font-medium mb-6">Rua Martins Júnior, 841 - Liberdade</p>
              <div className="flex justify-center gap-8 text-slate-700">
                <a href="https://instagram.com/iec_liberdade" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all cursor-pointer flex items-center gap-2">
                  <Instagram size={24} /> <span className="text-xs font-bold">@iec_liberdade</span>
                </a>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* --- Modais --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full relative border">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24}/></button>
            <h3 className="text-3xl font-black text-iecl-blue mb-2 tracking-tighter">Login EBD</h3>
            <p className="text-sm text-slate-400 mb-10 font-medium">Acesso restrito para alunos e administração.</p>
            {loginError && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3"><AlertCircle size={18}/> {loginError}</div>}
            <form onSubmit={handleLogin} className="space-y-6">
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Login</label><input required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:bg-white focus:border-iecl-blue transition-all font-bold" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Senha</label><input type="password" required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:bg-white focus:border-iecl-blue transition-all font-bold" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} /></div>
              <button className="w-full py-5 bg-iecl-blue text-white font-black rounded-[1.25rem] mt-6 shadow-2xl shadow-blue-900/30 uppercase tracking-widest text-xs active:scale-95 transition-all">Entrar no Sistema</button>
            </form>
          </div>
        </div>
      )}

      {selectedNews && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-3xl w-full overflow-hidden my-8 relative border">
            <button onClick={() => setSelectedNews(null)} className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 backdrop-blur-2xl text-white p-3 rounded-full z-10"><X size={24}/></button>
            <div className="h-96 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
              {selectedNews.image ? <img src={selectedNews.image} className="h-full w-full object-cover"/> : <ImageIcon size={80} className="text-slate-200"/>}
            </div>
            <div className="p-12">
              <span className="text-[10px] font-black text-iecl-blue bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest mb-6 inline-block">{selectedNews.category}</span>
              <h3 className="text-4xl font-black text-slate-800 mb-6 tracking-tighter leading-none">{selectedNews.title}</h3>
              <p className="text-sm font-bold text-slate-400 mb-10 flex items-center gap-2"><Calendar size={18}/> Publicado em {selectedNews.date}</p>
              <div className="prose prose-slate max-w-none text-slate-600 mb-12 text-lg font-medium leading-relaxed whitespace-pre-wrap">{selectedNews.content}</div>
              
              {copySuccess && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-2xl text-center font-bold animate-pulse">
                  {copySuccess}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t">
                <button onClick={() => handleCopyLink(selectedNews)} className="flex-1 py-5 bg-green-500 text-white font-black rounded-3xl hover:bg-green-600 uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> Convite WhatsApp
                </button>
                <button onClick={() => setSelectedNews(null)} className="flex-1 py-5 bg-slate-100 text-slate-700 font-black rounded-3xl hover:bg-slate-200 uppercase text-xs tracking-widest transition-all">
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewsForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto border">
            <h3 className="text-3xl font-black text-iecl-blue mb-8 tracking-tighter">{editingId ? 'Editar Aviso' : 'Novo Aviso'}</h3>
            <form onSubmit={handleSaveNews} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2"><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Título</label><input required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={newsFormData.title} onChange={e => setNewsFormData({...newsFormData, title: e.target.value})} /></div>
                <div className="col-span-2"><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">URL da Imagem</label><input className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={newsFormData.image} onChange={e => setNewsFormData({...newsFormData, image: e.target.value})} placeholder="https://..." /></div>
                <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Categoria</label><select className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={newsFormData.category} onChange={e => setNewsFormData({...newsFormData, category: e.target.value as any})}><option>Notícia</option><option>Evento</option></select></div>
                <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Dias Ativo</label><input type="number" required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={newsFormData.activeDays} onChange={e => setNewsFormData({...newsFormData, activeDays: parseInt(e.target.value)})} /></div>
                <div className="col-span-2 flex items-center gap-4 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <input type="checkbox" id="featured" checked={newsFormData.featured} onChange={e => setNewsFormData({...newsFormData, featured: e.target.checked})} className="w-6 h-6 rounded-lg text-iecl-blue" />
                  <div><label htmlFor="featured" className="text-sm font-black text-iecl-blue block">Exibir como Destaque (Máx 3)</label><p className="text-[10px] text-blue-400 font-bold uppercase mt-1">Aparece na página inicial do site.</p></div>
                </div>
                <div className="col-span-2"><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Resumo</label><textarea required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl h-24 resize-none font-medium" value={newsFormData.excerpt} onChange={e => setNewsFormData({...newsFormData, excerpt: e.target.value})} /></div>
                <div className="col-span-2"><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Descrição Completa</label><textarea required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl h-48 resize-none font-medium" value={newsFormData.content} onChange={e => setNewsFormData({...newsFormData, content: e.target.value})} /></div>
              </div>
              <div className="flex justify-end gap-4 pt-8 border-t border-slate-100"><button type="button" onClick={() => setShowNewsForm(false)} className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancelar</button><button type="submit" className="bg-iecl-blue text-white px-10 py-4 rounded-2xl font-black shadow-2xl hover:bg-slate-800 transition-all uppercase text-xs tracking-widest">Salvar no Sistema</button></div>
            </form>
          </div>
        </div>
      )}

      {showTeacherForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full border">
            <h3 className="text-3xl font-black text-iecl-blue mb-8 tracking-tighter">Dados do Professor</h3>
            <form onSubmit={handleSaveTeacher} className="space-y-6">
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nome Completo</label><input required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={teacherFormData.name} onChange={e => setTeacherFormData({...teacherFormData, name: e.target.value})} /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">E-mail</label><input type="email" required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={teacherFormData.email} onChange={e => setTeacherFormData({...teacherFormData, email: e.target.value})} /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Classe Vinculada</label><select className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={teacherFormData.teachingClassroomId} onChange={e => setTeacherFormData({...teacherFormData, teachingClassroomId: e.target.value})}><option value="">Nenhuma</option>{classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Status</label><div className="flex gap-4"><button type="button" onClick={() => setTeacherFormData({...teacherFormData, status: 'active'})} className={`flex-1 py-4 rounded-2xl border font-black text-xs uppercase ${teacherFormData.status === 'active' ? 'bg-green-50 text-green-700 border-green-500' : 'text-slate-400 border-slate-200'}`}>Ativo</button><button type="button" onClick={() => setTeacherFormData({...teacherFormData, status: 'inactive'})} className={`flex-1 py-4 rounded-2xl border font-black text-xs uppercase ${teacherFormData.status === 'inactive' ? 'bg-red-50 text-red-700 border-red-500' : 'text-slate-400 border-slate-200'}`}>Inativo</button></div></div>
              <div className="flex justify-end gap-4 pt-8 border-t border-slate-100"><button type="button" onClick={() => setShowTeacherForm(false)} className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancelar</button><button type="submit" className="bg-iecl-blue text-white px-10 py-4 rounded-2xl font-black shadow-2xl hover:bg-slate-800 transition-all uppercase text-xs tracking-widest">Salvar</button></div>
            </form>
          </div>
        </div>
      )}

      {showClassroomForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-xl w-full border">
            <h3 className="text-3xl font-black text-iecl-blue mb-8 tracking-tighter">Editar Turma</h3>
            <form onSubmit={handleSaveClassroom} className="space-y-6">
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nome da Classe</label><input required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={classroomFormData.name} onChange={e => setClassroomFormData({...classroomFormData, name: e.target.value})} /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Público Alvo</label><input required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={classroomFormData.targetAudience} onChange={e => setClassroomFormData({...classroomFormData, targetAudience: e.target.value})} /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">URL da Imagem</label><input required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={classroomFormData.image} onChange={e => setClassroomFormData({...classroomFormData, image: e.target.value})} /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Descrição</label><textarea required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl h-32 resize-none font-medium" value={classroomFormData.description} onChange={e => setClassroomFormData({...classroomFormData, description: e.target.value})} /></div>
              <div className="flex justify-end gap-4 pt-8 border-t border-slate-100"><button type="button" onClick={() => setShowClassroomForm(false)} className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancelar</button><button type="submit" className="bg-iecl-blue text-white px-10 py-4 rounded-2xl font-black shadow-2xl hover:bg-slate-800 transition-all uppercase text-xs tracking-widest">Salvar Turma</button></div>
            </form>
          </div>
        </div>
      )}

      {showScheduleForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full border">
            <h3 className="text-3xl font-black text-iecl-blue mb-8 tracking-tighter">Editar Horário</h3>
            <form onSubmit={handleSaveSchedule} className="space-y-6">
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Dia da Semana</label><select className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={scheduleFormData.day} onChange={e => setScheduleFormData({...scheduleFormData, day: e.target.value})}><option>Domingo</option><option>Segunda</option><option>Terça</option><option>Quarta</option><option>Quinta</option><option>Sexta</option><option>Sábado</option></select></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Título</label><input required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={scheduleFormData.title} onChange={e => setScheduleFormData({...scheduleFormData, title: e.target.value})} /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Horário</label><input required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" value={scheduleFormData.time} onChange={e => setScheduleFormData({...scheduleFormData, time: e.target.value})} placeholder="00:00 - 00:00" /></div>
              <div className="flex justify-end gap-4 pt-8 border-t border-slate-100"><button type="button" onClick={() => setShowScheduleForm(false)} className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancelar</button><button type="submit" className="bg-iecl-blue text-white px-10 py-4 rounded-2xl font-black shadow-2xl hover:bg-slate-800 transition-all uppercase text-xs tracking-widest">Salvar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}