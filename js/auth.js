const supabase = window.supabase.createClient(
  'https://zdmtwnvaksdbvutrpcnr.supabase.co', // твой URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkbXR3bnZha3NkYnZ1dHJwY25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1Mjg4NjcsImV4cCI6MjA4MzEwNDg2N30.QztruYbzPeF8CrZmT_FhMw6VHc1-289qqJ8Qs4Z7nVc'               // anon public key
);

// splash → auth
setTimeout(() => {
  document.querySelector('.splash-container').style.display = 'none';
  document.getElementById('authScreen').style.display = 'flex';
}, 6000);

// EMAIL → OTP
async function sendCode() {
  const email = document.getElementById('emailInput').value;
  if (!email) return alert('Введите email');

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById('authEmail').style.display = 'none';
  document.getElementById('authCode').style.display = 'block';
}

// VERIFY CODE
async function verifyCode() {
  const email = document.getElementById('emailInput').value;
  const token = document.getElementById('codeInput').value;

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert('Вы вошли');
}
