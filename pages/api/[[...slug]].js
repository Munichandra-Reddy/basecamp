import app, { ensureDbInitialized } from '../../src/backend/app.js';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  await ensureDbInitialized();
  return app(req, res);
}
