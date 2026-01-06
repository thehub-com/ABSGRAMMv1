let user;

document.addEventListener('DOMContentLoaded', async () => {
  const { data } = await supabase.auth.getUser();
  user = data.user;
  loadProfile();
});

async function loadProfile() {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (data) {
    username.value = data.username || '';
    bio.value = data.bio || '';
    if (data.avatar_url) avatar.src = data.avatar_url;
  }
}

async function saveProfile() {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      username: username.value,
      bio: bio.value
    });

  if (!error) alert('Профиль сохранён');
}
