// ================== DOM ==================
const splash = document.querySelector('.splash-container');
const authScreen = document.getElementById('authScreen');

const emailBox = document.getElementById('authEmail');
const codeBox = document.getElementById('authCode');

const emailInput = document.getElementById('emailInput');
const codeInput = document.getElementById('codeInput');

let currentEmail = '';

// ================== SPLASH → AUTH ==================
setTimeout(() => {
  splash.style.display = 'none';
  authScreen.style.display = 'flex';
}, 6000);

// ================== SEND CODE ==================
async function sendCode() {
  const email = emailInput.value.trim();
  if (!email) return;

  currentEmail = email;

  const { error } = await window.supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true }
  });

  if (error) {
    console.error('OTP error:', error.message);
    return;
  }

  emailBox.style.display = 'none';
  codeBox.style.display = 'block';
}

// ================== VERIFY CODE ==================
async function verifyCode() {
  const code = codeInput.value.trim();
  if (!code) return;

  const { data, error } = await window.supabase.auth.verifyOtp({
    email: currentEmail,
    token: code,
    type: 'email'
  });

  if (error) {
    console.error('Verify error:', error.message);
    return;
  }

  const user = data.user;

  const { data: profile } = await window.supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    const username = prompt('Введите username');
    if (!username) return;

    await window.supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      username
    });
  }

  window.location.href = 'chats.html';
}
