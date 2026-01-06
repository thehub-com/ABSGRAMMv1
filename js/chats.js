const supabase = window.supabase.createClient(
  'https://zdmtwnvaksdbvutrpcnr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkbXR3bnZha3NkYnZ1dHJwY25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1Mjg4NjcsImV4cCI6MjA4MzEwNDg2N30.QztruYbzPeF8CrZmT_FhMw6VHc1-289qqJ8Qs4Z7nVc'
);

const chatList = document.getElementById('chatList');
const searchInput = document.getElementById('searchInput');

let users = [];

// ПРОВЕРКА АВТОРИЗАЦИИ
(async () => {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = 'index.html';
  }
  loadUsers();
})();

// ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ
async function loadUsers() {
  const { data } = await supabase
    .from('profiles')
    .select('id, username');

  users = data || [];
  render(users);
}

// РЕНДЕР
function render(list) {
  chatList.innerHTML = '';
  list.forEach(u => {
    const div = document.createElement('div');
    div.className = 'chat-item';
    div.innerHTML = `
      <div class="chat-avatar">${u.username[0]}</div>
      <div class="chat-info">
        <h3>${u.username}</h3>
        <p>Нажмите, чтобы написать</p>
      </div>
    `;
    chatList.appendChild(div);
  });
}

// ПОИСК
searchInput.addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  render(users.filter(u => u.username.toLowerCase().includes(q)));
});
