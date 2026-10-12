import { createFileRoute } from '@tanstack/react-router';
import { NinjaApp } from '@/components/ninja/app';
export const Route = createFileRoute('/chat/$threadId')({
 head: () => ({ meta: [{ title: 'Ninja Session — The Code Ninja' }, { name: 'description', content: 'Your personal coding session with The Code Ninja.' }, { property: 'og:title', content: 'Ninja Session — The Code Ninja' }, { property: 'og:description', content: 'Generate, explain and refine code in your ninja workspace.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 component: ThreadPage,
});
function ThreadPage() { const { threadId } = Route.useParams(); return <NinjaApp key={threadId} threadId={threadId}/>; }
