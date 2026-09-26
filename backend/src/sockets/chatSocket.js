export function initSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-project', (projectId) => {
      socket.join(`project-${projectId}`);
      console.log(`Socket ${socket.id} joined project-${projectId}`);
    });

    socket.on('leave-project', (projectId) => {
      socket.leave(`project-${projectId}`);
    });

    socket.on('send-message', (data) => {
      // Broadcast to everyone in project room
      io.to(`project-${data.project_id}`).emit('receive-message', data);
    });

    socket.on('typing', (data) => {
      socket.to(`project-${data.project_id}`).emit('user-typing', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
