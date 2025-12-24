INSERT INTO posts (id, authorId, title, body, category, tags, createdAt, updatedAt, views, likes, useful, thanks)
VALUES (
  'test-post-other-user',
  'other-user-999',
  'Post de Teste - Outro Usuário',
  'Este post foi criado por outro usuário. Comenta aqui para receber notificação!',
  'duvida',
  '["teste"]',
  datetime('now'),
  datetime('now'),
  0, 0, 0, 0
);
