
import fs from 'fs';
import path from 'path';

const postsLayout = path.join(process.cwd(), 'src/data/posts.json');
const analyticsLayout = path.join(process.cwd(), 'src/data/analytics.json');

const leadsLayout = path.join(process.cwd(), 'src/data/leads.json');




export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML/Markdown
  excerpt: string;
  image: string;
  tags: string[];
  date: string;
  author: string;
}

export interface AnalyticsEvent {
  id: string;
  path: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  referrer: string;
  deviceType: string;
  metadata?: Record<string, unknown>; // Flexible Signal Tracking
}

export interface Lead {
  id: string;
  email: string;
  source: string; // "ROI Calculator", "Quiz", "Newsletter"
  data?: Record<string, unknown>; // Quiz results, Calculator inputs
  timestamp: string;
}

export function getPosts(): BlogPost[] {
  if (!fs.existsSync(postsLayout)) return [];
  const file = fs.readFileSync(postsLayout, 'utf8');
  return JSON.parse(file);
}

export function savePost(post: BlogPost) {
  const posts = getPosts();
  const existingIndex = posts.findIndex(p => p.id === post.id);

  if (existingIndex > -1) {
    posts[existingIndex] = post;
  } else {
    posts.unshift(post);
  }

  fs.writeFileSync(postsLayout, JSON.stringify(posts, null, 2));
}

export function getAnalytics(): AnalyticsEvent[] {
  if (!fs.existsSync(analyticsLayout)) return [];
  const file = fs.readFileSync(analyticsLayout, 'utf8');
  return JSON.parse(file);
}

export function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) {
  const events = getAnalytics();
  const newEvent: AnalyticsEvent = {
    ...event,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };
  // Keep only last 1000 events to prevent file bloat in demo
  if (events.length > 1000) events.pop();
  events.unshift(newEvent);
  fs.writeFileSync(analyticsLayout, JSON.stringify(events, null, 2));
}

export function getLeads(): Lead[] {
  if (!fs.existsSync(leadsLayout)) return [];
  const file = fs.readFileSync(leadsLayout, 'utf8');
  return JSON.parse(file);
}

export function saveLead(lead: Omit<Lead, 'id' | 'timestamp'>) {
  const leads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };
  leads.unshift(newLead);
  fs.writeFileSync(leadsLayout, JSON.stringify(leads, null, 2));
}


