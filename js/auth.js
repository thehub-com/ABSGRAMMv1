let tempEmail = '';

async function sendCode() {
  tempEmail = emailInput.value.trim();

  if (!tempEmail) {
    alert('Введите email');
    return;
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: tempEmail
  });

  if (error) {
    alert(error.message);
    return;
  }

  authEmail.classList.add('hidden');
  authCode.classList.remove('hidden');
}

async function verifyCode() {
  const code = codeInput.value.trim();

  if (!code) {
    alert('Введите код');
    return;
  }

  const { error } = await supabase.auth.verifyOtp({
    email: tempEmail,
    token: code,
    type: 'email'
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert('Вы вошли ✅');
}
