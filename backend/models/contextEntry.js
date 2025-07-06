import { v4 as uuidv4 } from 'uuid';

export class ContextEntry {
  constructor({
    content,
    source = 'manual',
    insights = undefined
  }) {
    this.id = uuidv4();
    this.content = content;
    this.source = source;
    this.timestamp = new Date();
    this.processed = false;
    this.insights = insights;
  }
} 