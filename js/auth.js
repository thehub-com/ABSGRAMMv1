// js/auth.js

document.addEventListener('DOMContentLoaded', async () => {
  const splash = document.querySelector('.splash-container');
  const authScreen = document.getElementById('authScreen');

  // splash → auth
  setTimeout(() => {
    splash.style.display = 'none';
    authScreen.style.display = 'flex';
  }, 6000);

  // если уже есть сессия → сразу в чаты
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    window.location.href = 'chats.html';
  }
});

let currentEmail = '';

// ================= SEND CODE =================
async function sendCode() {
  const emailInput = document.getElementById('emailInput');
  const email = emailInput.value.trim();

  if (!email) return;

  currentEmail = email;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true
    }
  });

  if (error) {
    console.error(error.message);
    return;
  }

  document.getElementById('authEmail').style.display = 'none';
  document.getElementById('authCode').style.display = 'block';
}

// ================= VERIFY CODE =================
async function verifyCode() {
  const codeInput = document.getElementById('codeInput');
  const code = codeInput.value.trim();

  if (!code) return;

  const { data, error } = await supabase.auth.verifyOtp({
    email: currentEmail,
    token: code,
    type: 'email'
  });

  if (error) {
    console.error(error.message);
    return;
  }

  const user = data.user;

  // профиль
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    const username = prompt('Введите username');
    if (!username) return;

    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      username
    });
  }

  // ✅ ПЕРЕХОД В ЧАТЫ
  window.location.href = 'chats.html';
}
