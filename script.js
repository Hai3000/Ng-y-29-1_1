const API = "http://localhost:3000";

// ================= POSTS =================

function loadPosts() {
  fetch(`${API}/posts`)
    .then(res => res.json())
    .then(renderPosts);
}

function renderPosts(posts) {
  const table = document.getElementById("postTable");
  table.innerHTML = "";

  posts.forEach(p => {
    const style = p.isDeleted ? "text-decoration:line-through;color:gray;" : "";

    table.innerHTML += `
      <tr style="${style}">
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>${p.views}</td>
        <td>
          ${p.isDeleted ? "Đã xoá" :
            `<button class="btn btn-danger btn-sm" onclick="softDeletePost('${p.id}')">Xoá</button>`}
        </td>
      </tr>
    `;
  });
}

function generatePostId() {
  return fetch(`${API}/posts`)
    .then(res => res.json())
    .then(posts => {
      const maxId = posts.length ? Math.max(...posts.map(p => Number(p.id))) : 0;
      return String(maxId + 1);
    });
}

function createPost() {
  const title = document.getElementById("title").value;
  const views = document.getElementById("views").value;

  generatePostId().then(id => {
    const newPost = { id, title, views, isDeleted: false };

    fetch(`${API}/posts`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(newPost)
    }).then(loadPosts);
  });
}

function softDeletePost(id) {
  fetch(`${API}/posts/${id}`, {
    method: "PATCH",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ isDeleted: true })
  }).then(loadPosts);
}

// ================= COMMENTS =================

function loadComments() {
  fetch(`${API}/comments`)
    .then(res => res.json())
    .then(renderComments);
}

function renderComments(comments) {
  const table = document.getElementById("commentTable");
  table.innerHTML = "";

  comments.forEach(c => {
    table.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.postId}</td>
        <td>${c.text}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="updateComment('${c.id}')">Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="deleteComment('${c.id}')">Xoá</button>
        </td>
      </tr>
    `;
  });
}

function generateCommentId() {
  return fetch(`${API}/comments`)
    .then(res => res.json())
    .then(comments => {
      const maxId = comments.length ? Math.max(...comments.map(c => Number(c.id))) : 0;
      return String(maxId + 1);
    });
}

function createComment() {
  const postId = document.getElementById("cPostId").value;
  const text = document.getElementById("cText").value;

  generateCommentId().then(id => {
    const newComment = { id, postId, text };

    fetch(`${API}/comments`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(newComment)
    }).then(loadComments);
  });
}

function updateComment(id) {
  const newText = prompt("Nhập nội dung mới:");

  if (!newText) return;

  fetch(`${API}/comments/${id}`, {
    method: "PATCH",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ text: newText })
  }).then(loadComments);
}

function deleteComment(id) {
  fetch(`${API}/comments/${id}`, { method: "DELETE" })
    .then(loadComments);
}

// ================= INIT =================

loadPosts();
loadComments();
