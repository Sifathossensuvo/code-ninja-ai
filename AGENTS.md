<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Chat page IDs come from `/chat/$threadId`; browser-local thread records store complete AI SDK UIMessage parts to preserve conversation separation and history.
- The AI streaming boundary is `/api/chat`, with provider configuration in server-only modules; no chat history is stored in Cloud.
- Use AI Elements for the transcript, markdown, loading state and composer, with visual roles defined in the global design system.
- Thread deletion uses browser-storage helpers; missing or deleted thread URLs redirect to an existing or fresh session rather than recreating a deleted ID.
- Workspace overflow is handled by bounded scrolling regions; narrow screens retain system panels below the primary workspace and navigation in a scrollable drawer.
