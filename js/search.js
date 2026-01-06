async function searchUsers() {
  const q = searchInput.value.trim();

  if (!q) {
    results.innerHTML = '';
    return;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username')
    .ilike('username', `%${q}%`)
    .limit(20);

  if (error) {
    console.log(error);
    return;
  }

  results.innerHTML = '';

  data.forEach(u => {
    const div = document.createElement('div');
    div.className = 'user-item';
    div.textContent = u.username;

    div.onclick = () => {
      location.href = `chat.html?uid=${u.id}`;
    };

    results.appendChild(div);
  });
}
