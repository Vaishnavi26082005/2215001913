import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;
const API = 'http://20.244.56.144/evaluation-service';

app.get('/users', async (req, res) => {
  try {
    const usersRes = await axios.get(`${API}/users`);
    const users = usersRes.data.users;
    let result = [];

    for (const [userId, name] of Object.entries(users)) {
      const postsRes = await axios.get(`${API}/users/${userId}/posts`);
      const posts = postsRes.data.posts || [];
      let commentCount = 0;

      for (const post of posts) {
        const commentsRes = await axios.get(`${API}/posts/${post.id}/comments`);
        commentCount += commentsRes.data.comments?.length || 0;
      }

      result.push({ name, commentCount });
    }

    result.sort((a, b) => b.commentCount - a.commentCount);
    res.json(result.slice(0, 5));
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/posts', async (req, res) => {
  const type = req.query.type;
  if (!['latest', 'popular'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type query param' });
  }

  const usersRes = await axios.get(`${API}/users`);
  const users = usersRes.data.users;
  let allPosts = [];

  for (const userId of Object.keys(users)) {
    const postsRes = await axios.get(`${API}/users/${userId}/posts`);
    allPosts.push(...(postsRes.data.posts || []));
  }

  if (type === 'latest') {
    allPosts.sort((a, b) => b.id - a.id);
    return res.json(allPosts.slice(0, 5));
  }

  if (type === 'popular') {
    let postStats = [];

    for (const post of allPosts) {
      const commentsRes = await axios.get(`${API}/posts/${post.id}/comments`);
      const count = commentsRes.data.comments?.length || 0;
      postStats.push({ post, count });
    }

    const max = Math.max(...postStats.map(p => p.count));
    const mostCommented = postStats.filter(p => p.count === max).map(p => p.post);
    return res.json(mostCommented);
  }
});

app.listen(PORT, () => {
  console.log(`Social Media Analytics running at http://localhost:${PORT}`);
});
