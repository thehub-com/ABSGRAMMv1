const supabase = window.supabase.createClient(
  'https://zdmtwnvaksdbvutrpcnr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkbXR3bnZha3NkYnZ1dHJwY25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1Mjg4NjcsImV4cCI6MjA4MzEwNDg2N30.QztruYbzPeF8CrZmT_FhMw6VHc1-289qqJ8Qs4Z7nVc'
);

// SPLASH → AUTH
setTimeout(() => {
  document.querySelector('.splash-container').style.display = 'none';
  document.getElementById('authScreen').style.display = 'flex';
}, 6000);

let currentEmail = '';

// SEND CODE
async function sendCode() {
  const email = document.getElementById('emailInput').value.trim();
  if (!email) return;

  currentEmail = email;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true }
  });

  if (error) {
    console.error(error.message);
    return;
  }

  document.getElementById('authEmail').style.display = 'none';
  document.getElementById('authCode').style.display = 'block';
}

// VERIFY CODE
async function verifyCode() {
  const code = document.getElementById('codeInput').value.trim();
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

  window.location.href = '/chats.html';
}
