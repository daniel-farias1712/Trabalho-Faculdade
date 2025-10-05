
/*
  script.js - Controle frontend do PsicOnline
  --------------------------------------------------
  - Gerencia tema (claro/escuro) salvo em localStorage
  - Gera menu dinamicamente conforme tipo de usuário (patient / psychologist)
  - Gerencia menu hambúrguer (mobile)
  - Intercepta formulários de login/cadastro e tenta enviar para backend (/api/login, /api/register)
    - Se o backend não estiver disponível, usa um fallback local (mock) para testar fluxos
  - Implementa verificações de acesso por página:
    - Paciente: acessa apenas páginas de paciente
    - Psicólogo: acessa todas as páginas (incluindo perfil do paciente)
  - Comentários em português explicando pontos de integração com backend
*/

(() => {
  // --- Constantes e utilitários ---
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));
  const STORAGE = { THEME: 'psic_theme', USER: 'psic_user', MOCK: 'psic_mock_users' };
  const nav = qs('#main-nav');
  const menuToggle = qs('#menu-toggle');
  const themeToggle = qs('#theme-toggle');

  // Recupera usuário atual da sessão (localStorage)
  function getUser() {
    try { return JSON.parse(localStorage.getItem(STORAGE.USER)); }
    catch(e){ return null; }
  }
  function setUser(u) { localStorage.setItem(STORAGE.USER, JSON.stringify(u)); }
  function clearUser() { localStorage.removeItem(STORAGE.USER); }

  // --- Monta menu conforme role ---
  function buildMenu() {
    const user = getUser();
    if (!nav) return;
    if (!user) { nav.innerHTML = ''; nav.setAttribute('aria-hidden','true'); return; }

    const isPsych = user.role === 'psychologist';
    const isPatient = user.role === 'patient';

    const items = [];
    // Itens comuns
    items.push({ href: 'atendimento.html', text: 'Atendimento' });
    items.push({ href: 'notificacoes.html', text: 'Notificações' });
    items.push({ href: 'agendamento.html', text: 'Agendamento' });
    items.push({ href: 'anotacoes.html', text: 'Anotações' });

    // Paciente: Meu Perfil + Gamificação
    if (isPatient) {
      items.unshift({ href: 'perfil_paciente.html', text: 'Meu Perfil' });
      items.push({ href: 'gamificacao.html', text: 'Gamificação' });
    }

    // Psicólogo: vê tudo e Perfil profissional
    if (isPsych) {
      items.unshift({ href: 'perfil_psicologo.html', text: 'Meu Perfil (Psicólogo)' });
      // Permite também abrir perfil do paciente para consulta
      items.push({ href: 'perfil_paciente.html', text: 'Perfil do Paciente' });
      items.push({ href: 'gamificacao.html', text: 'Gamificação (Paciente)' });
    }

    // Botão de logout
    items.push({ href: '#logout', text: 'Sair', logout: true });

    const ul = document.createElement('ul');
    ul.className = 'menu';
    items.forEach(it => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = it.href;
      a.textContent = it.text;
      if (it.logout) {
        a.addEventListener('click', (e) => { e.preventDefault(); doLogout(); });
      }
      li.appendChild(a);
      ul.appendChild(li);
    });
    nav.innerHTML = '';
    nav.appendChild(ul);
    nav.setAttribute('aria-hidden','false');
  }

  // --- Logout ---
  function doLogout() {
    clearUser();
    buildMenu();
    // redireciona para landing page
    window.location.href = 'index.html';
  }

  // --- Tema ---
  (function initTheme(){
    const saved = localStorage.getItem(STORAGE.THEME);
    if (saved === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
    themeToggle && themeToggle.addEventListener('click', ()=>{
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem(STORAGE.THEME, isLight ? 'light' : 'dark');
    });
  })();

  // --- Menu hambúrguer ---
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // --- Form handling (login/register) ---
  qsa('form').forEach(form => {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const feedback = form.querySelector('.feedback');
      if (feedback) { feedback.style.display = 'none'; }

      // Validação básica HTML5
      if (!form.checkValidity()) {
        if (feedback) { feedback.textContent = 'Preencha corretamente os campos.'; feedback.style.display = 'block'; }
        return;
      }

      // Coleta dados do formulário
      const fd = new FormData(form);
      const payload = {};
      fd.forEach((v,k) => payload[k] = v);

      const endpoint = form.getAttribute('action') || '/api/submit';
      const method = (form.getAttribute('method') || 'post').toUpperCase();

      if (feedback) { feedback.textContent = 'Processando...'; feedback.style.display = 'block'; }

      try {
        // Tenta enviar ao backend; o backend deve retornar JSON { ok:true, role, token, name }
        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          const userObj = { name: data.name || payload.name || payload.email, email: payload.email, role: data.role || payload.role, token: data.token };
          setUser(userObj);
          buildMenu();
          if (feedback) { feedback.textContent = 'Sucesso. Redirecionando...'; }
          setTimeout(()=>{
            if (userObj.role === 'psychologist') window.location.href = 'perfil_psicologo.html';
            else window.location.href = 'perfil_paciente.html';
          }, 800);
          return;
        } else {
          if (feedback) { feedback.textContent = data.message || 'Erro no servidor.'; }
          return;
        }
      } catch (err) {
        // Backend não disponível: usar fallback local (apenas para testes)
        console.warn('Fallback local ativado (sem backend).', err);
        const path = endpoint.toLowerCase();
        if (path.includes('/register')) {
          const all = JSON.parse(localStorage.getItem(STORAGE.MOCK) || '[]');
          if (all.find(u => u.email === payload.email)) { if (feedback) { feedback.textContent = 'E-mail já cadastrado.'; } return; }
          const newUser = { name: payload.name || payload.email, email: payload.email, password: payload.password, role: payload.role || 'patient' };
          all.push(newUser);
          localStorage.setItem(STORAGE.MOCK, JSON.stringify(all));
          setUser({ name: newUser.name, email: newUser.email, role: newUser.role });
          buildMenu();
          if (feedback) { feedback.textContent = 'Conta criada (modo offline). Redirecionando...'; }
          setTimeout(()=> { if (newUser.role === 'psychologist') window.location.href = 'perfil_psicologo.html'; else window.location.href = 'perfil_paciente.html'; }, 900);
          return;
        } else if (path.includes('/login')) {
          const all = JSON.parse(localStorage.getItem(STORAGE.MOCK) || '[]');
          const user = all.find(u => u.email === payload.email && u.password === payload.password);
          if (!user) { if (feedback) { feedback.textContent = 'Usuário não encontrado ou senha incorreta.'; } return; }
          setUser({ name: user.name, email: user.email, role: user.role });
          buildMenu();
          if (feedback) { feedback.textContent = 'Login (offline) bem-sucedido. Redirecionando...'; }
          setTimeout(()=> { if (user.role === 'psychologist') window.location.href = 'perfil_psicologo.html'; else window.location.href = 'perfil_paciente.html'; }, 700);
          return;
        } else {
          if (feedback) { feedback.textContent = 'Erro de rede. Ação não pode ser concluída.'; }
          return;
        }
      }
    });
  });

  // --- Acesso por página ---
  document.addEventListener('DOMContentLoaded', ()=>{
    buildMenu(); // monta menu se estiver logado
    const user = getUser();
    const path = window.location.pathname.split('/').pop();

    // Regras de acesso (quem pode visualizar cada página)
    const rules = {
      'perfil_paciente.html': ['patient','psychologist'],
      'perfil_psicologo.html': ['psychologist'],
      'gamificacao.html': ['patient','psychologist'],
      'atendimento.html': ['patient','psychologist'],
      'notificacoes.html': ['patient','psychologist'],
      'agendamento.html': ['patient','psychologist'],
      'anotacoes.html': ['patient','psychologist']
    };

    function redirectHome() {
      if (!user) return window.location.href = 'index.html';
      if (user.role === 'psychologist') return window.location.href = 'perfil_psicologo.html';
      return window.location.href = 'perfil_paciente.html';
    }

    // Se a página estiver protegida, aplicar verificação
    if (rules[path]) {
      if (!user) {
        redirectHome();
        return;
      }
      if (!rules[path].includes(user.role)) {
        redirectHome();
        return;
      }
    }

    // Inserir nome do usuário quando aplicável
    const nameEl = qs('#user-name');
    if (nameEl && user) nameEl.textContent = user.name || user.email;
  });

  // Expor logout para testes caso necessário
  window.__PSICAPP = { logout: doLogout };
})();
