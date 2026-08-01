const fs = require('fs');
const path = require('path');

const pages = [
  'admin/manage-classes',
  'admin/attendance',
  'admin/analytics',
  'admin/events',
  'admin/meetings',
  'admin/reports',
  'admin/settings',
  'teacher/classes',
];

const content = `"use client";
import EmptyState from '@/components/EmptyState';
export default function Placeholder() {
  return (
    <div className="py-12">
      <EmptyState icon="build" title="Under Construction" description="This feature is coming in the next update." />
    </div>
  );
}`;

pages.forEach(p => {
  const dir = path.join('src/app', p);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.js'), content);
});
console.log('Done creating placeholders');
