// Example workflows shown in the AI + Automation section (illustrations of what can be built).

export interface Workflow {
  id: string;
  title: string;
  outcome: string;
  steps: string[];
}

export const workflows: Workflow[] = [
  {
    id: 'lead-follow-up',
    title: 'Instant lead follow-up',
    outcome: 'Every enquiry gets a reply in seconds, not hours.',
    steps: ['Lead capture', 'CRM record', 'WhatsApp / email follow-up'],
  },
  {
    id: 'ai-qualification',
    title: 'AI lead qualification',
    outcome: 'Serious enquiries reach you first, with a summary.',
    steps: ['Form submission', 'AI qualification', 'Sales notification'],
  },
  {
    id: 'lead-scoring',
    title: 'Visitor lead scoring',
    outcome: 'Know which leads are ready to buy.',
    steps: ['Website visitor', 'Lead scoring', 'CRM'],
  },
  {
    id: 'content-publishing',
    title: 'Content approval & publishing',
    outcome: 'Posts go out on schedule after one-tap approval.',
    steps: ['Social content', 'Approval', 'Publishing workflow'],
  },
  {
    id: 'ai-support',
    title: 'AI enquiry responses',
    outcome: 'Common questions answered instantly, edge cases escalated.',
    steps: ['Customer enquiry', 'AI response', 'Human escalation'],
  },
  {
    id: 'order-notifications',
    title: 'Order & invoice notifications',
    outcome: 'Orders recorded and the right people notified automatically.',
    steps: ['Invoice / order', 'Database', 'Notification'],
  },
];
