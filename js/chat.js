const supabase = window.supabase.createClient(
  'https://zdmtwnvaksdbvutrpcnr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkbXR3bnZha3NkYnZ1dHJwY25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1Mjg4NjcsImV4cCI6MjA4MzEwNDg2N30.QztruYbzPeF8CrZmT_FhMw6VHc1-289qqJ8Qs4Z7nVc'
);

const messagesEl = document.getElementById('messages');
const input = document.getElementById('messageInput');

let myId;
let chatUserId;

// GET USER
(async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) location.href = 'index.html';
  myId = data.user.id;

  const params = new URLSearchParams(location.search);
  chatUserId = params.get('uid');

  loadMessages();
  subscribe();
})();

// LOAD
async function loadMessages() {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .or(`sender.eq.${myId},receiver.eq.${myId}`)
    .order('created_at');

  messagesEl.innerHTML = '';
  data.forEach(draw);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// DRAW
function draw(m) {
  const div = document.createElement('div');
  div.className = `msg ${m.sender === myId ? 'me' : 'other'}`;
  div.textContent = m.text;

  if (m.sender === myId) {
    let pressTimer;

    div.addEventListener('touchstart', () => {
      pressTimer = setTimeout(() => {
        selectedMessageId = m.id;
        menu.classList.remove('hidden');
      }, 500);
    });

    div.addEventListener('touchend', () => {
      clearTimeout(pressTimer);
    });
  }

  messagesEl.appendChild(div);
}

// SEND
async function sendMessage() {
  if (!input.value) return;

  await supabase.from('messages').insert({
    sender: myId,
    receiver: chatUserId,
    text: input.value
  });

  input.value = '';
}

// REALTIME
function subscribe() {
  supabase.channel('messages')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      payload => draw(payload.new)
    ).subscribe();
}
async function deleteMessage() {
  await supabase.from('messages').delete().eq('id', selectedMessageId);
  menu.classList.add('hidden');
  loadMessages();
}

async function editMessage() {
  const newText = prompt('Новое сообщение');
  if (!newText) return;

  await supabase.from('messages')
    .update({ text: newText })
    .eq('id', selectedMessageId);

  menu.classList.add('hidden');
  loadMessages();
}
