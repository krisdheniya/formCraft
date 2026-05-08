// utils/idGenerator.js — nanoid wrapper
import { nanoid } from 'nanoid';

export function generateId() {
  return nanoid(12);
}
