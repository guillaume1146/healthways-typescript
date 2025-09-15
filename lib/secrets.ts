import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import * as fs from 'fs';
import * as path from 'path';

const client = new SecretManagerServiceClient();

export async function getSecret(secretName: string): Promise<string> {
  if (process.env.NODE_ENV !== 'production') {
    const filePath = path.join(process.cwd(), 'credentials', `${secretName}.json`);
    return fs.readFileSync(filePath, 'utf8');
  }

  const projectId = 'healthtechmvp';
  const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
  const [version] = await client.accessSecretVersion({ name });
  const payload = version.payload?.data?.toString();
  if (!payload) {
    throw new Error(`Secret ${secretName} not found`);
  }
  return payload;
}

export async function initializeServiceAccounts() {
  if (process.env.NODE_ENV === 'production') {
    try {
      const storageSecret = await getSecret('storage-service-account');
      const vertexSecret = await getSecret('vertex-service-account');
      
      process.env.STORAGE_SERVICE_ACCOUNT = storageSecret;
      process.env.VERTEX_SERVICE_ACCOUNT = vertexSecret;
    } catch (error) {
      console.error('Failed to load service accounts from Secret Manager:', error);
    }
  }
}