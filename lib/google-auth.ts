import { Storage } from '@google-cloud/storage';
import { VertexAI } from '@google-cloud/vertexai';
import * as fs from 'fs';
import * as path from 'path';

let storageClient: Storage | null = null;
let vertexClient: VertexAI | null = null;

export function getStorageClient(): Storage {
  if (!storageClient) {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.STORAGE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.STORAGE_SERVICE_ACCOUNT);
        storageClient = new Storage({
          credentials: serviceAccount,
          projectId: 'healthtechmvp'
        });
      } else {
        storageClient = new Storage({
          projectId: 'healthtechmvp'
        });
      }
    } else {
      storageClient = new Storage({
        keyFilename: './credentials/storage-sa.json',
        projectId: 'healthtechmvp'
      });
    }
  }
  return storageClient;
}

export function getVertexClient(): VertexAI {
  if (!vertexClient) {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.VERTEX_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.VERTEX_SERVICE_ACCOUNT);
        vertexClient = new VertexAI({
          project: 'healthtechmvp',
          location: 'us-central1',
          googleAuthOptions: {
            credentials: serviceAccount
          }
        });
      } else {
        vertexClient = new VertexAI({
          project: 'healthtechmvp',
          location: 'us-central1'
        });
      }
    } else {
      try {
        const credPath = path.join(process.cwd(), 'credentials', 'vertex-sa.json');
        const serviceAccount = JSON.parse(fs.readFileSync(credPath, 'utf8'));
        vertexClient = new VertexAI({
          project: 'healthtechmvp',
          location: 'us-central1',
          googleAuthOptions: {
            credentials: serviceAccount
          }
        });
      } catch (error) {
        console.error('Failed to load vertex credentials:', error);
        vertexClient = new VertexAI({
          project: 'healthtechmvp',
          location: 'us-central1'
        });
      }
    }
  }
  return vertexClient;
}