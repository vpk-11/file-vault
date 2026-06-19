const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Request failed');
  return data as T;
}

export interface FileEntry {
  storedName: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface AuthUser {
  id: string;
  uname: string;
}

export const api = {
  signup: (uname: string, pswd: string, age: number, email: string) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ uname, pswd, age, email })
    }),

  login: (uname: string, pswd: string) =>
    request<{ message: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ uname, pswd })
    }),

  logout: () =>
    request('/auth/logout', { method: 'POST' }),

  me: () =>
    request<{ user: AuthUser }>('/auth/me'),

  listFiles: () =>
    request<{ files: FileEntry[] }>('/files'),

  uploadFile: (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return fetch(`${BASE}/files/upload`, {
      method: 'POST',
      credentials: 'include',
      body: form
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
      return data as FileEntry;
    });
  },

  deleteFile: (storedName: string) =>
    fetch(`${BASE}/files/${storedName}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(async res => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Delete failed');
      }
    }),

  downloadUrl: (storedName: string) => `${BASE}/files/${storedName}`
};
