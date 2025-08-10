import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export function mountSwagger(app: express.Express) {
  const file = path.join(process.cwd(), 'openapi', 'openapi.yaml');
  const raw = fs.readFileSync(file, 'utf-8');
  const doc = yaml.parse(raw);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
}
