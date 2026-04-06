import fs from 'fs/promises';

const moves = [
  { from: /@\/services\/api/g, to: '@/shared/services/api' },
  { from: /@\/services\/authService/g, to: '@/shared/services/authService' },
  { from: /@\/features\/profile\/profileService/g, to: '@/features/profile/services/profileService' },
  { from: /@\/features\/editor\/editorService/g, to: '@/features/editor/services/editorService' },
  { from: /@\/features\/notifications\/notificationService/g, to: '@/features/notifications/services/notificationService' },
  { from: /@\/features\/posts\/postService/g, to: '@/features/posts/services/postService' },
  { from: /@\/features\/editor\/Editor/g, to: '@/features/editor/components/Editor' },
  { from: /@\/features\/comments\/CommentsSection/g, to: '@/features/comments/components/CommentsSection' },
  { from: /@\/features\/notifications\/NotificationDropdown/g, to: '@/features/notifications/components/NotificationDropdown' },
  { from: /@\/features\/posts\/StaffPicks/g, to: '@/features/posts/pages/StaffPicks' },
  { from: /from\s+['"]\.\.\/features\/posts\/Feed['"]/g, to: 'from "../features/posts/pages/Feed"' },
  { from: /from\s+['"]\.\.\/features\/editor\/Editor['"]/g, to: 'from "../features/editor/components/Editor"' },
  
  // Specific file fixes for relative imports inside features broken by the move:
];

async function replaceInFile(filePath, replacements) {
    try {
        let content = await fs.readFile(filePath, 'utf8');
        let org = content;
        for (const {from, to} of replacements) {
            content = content.replace(from, to);
        }
        if (content !== org) {
            await fs.writeFile(filePath, content);
            console.log("Updated", filePath);
        }
    } catch (e) { }
}

async function fixSpecific() {
    // comments/components
    await replaceInFile('src/features/comments/components/CommentItem.tsx', [
        { from: /from\s+['"]\.\/types['"]/g, to: 'from "../types"' }
    ]);
    await replaceInFile('src/features/comments/components/CommentsSection.tsx', [
        { from: /from\s+['"]\.\/types['"]/g, to: 'from "../types"' },
        { from: /from\s+['"]\.\/CommentItem['"]/g, to: 'from "./CommentItem"' } // this is fine
    ]);
    
    // editor/components
    await replaceInFile('src/features/editor/components/Editor.tsx', [
        { from: /from\s+['"]\.\/editorService['"]/g, to: 'from "../services/editorService"' }
    ]);
    
    // notifications/components
    await replaceInFile('src/features/notifications/components/NotificationDropdown.tsx', [
        { from: /from\s+['"]\.\/notificationService['"]/g, to: 'from "../services/notificationService"' }
    ]);
    
    // posts/pages
    await replaceInFile('src/features/posts/pages/Feed.tsx', [
        { from: /from\s+['"]\.\/postService['"]/g, to: 'from "../services/postService"' },
        { from: /from\s+['"]\.\/components\/PostCard['"]/g, to: 'from "../components/PostCard"' }
    ]);
    await replaceInFile('src/features/posts/pages/PostDetail.tsx', [
        { from: /from\s+['"]\.\/components\/PostActions['"]/g, to: 'from "../components/PostActions"' },
        { from: /from\s+['"]\.\/components\/PostOwnerActions['"]/g, to: 'from "../components/PostOwnerActions"' }
    ]);
    await replaceInFile('src/features/posts/pages/StaffPicks.tsx', [
        { from: /from\s+['"]\.\/postService['"]/g, to: 'from "../services/postService"' }
    ]);
    
    // posts/services
    await replaceInFile('src/features/posts/services/postService.ts', [
        { from: /from\s+['"]\.\/types['"]/g, to: 'from "../types"' }
    ]);
    
    // profile/components
    await replaceInFile('src/features/profile/components/FollowButton.tsx', [
        { from: /from\s+['"]\.\/profileService['"]/g, to: 'from "../services/profileService"' },
        { from: /from\s+['"]\.\/types['"]/g, to: 'from "../types"' }
    ]);
    await replaceInFile('src/features/profile/components/FollowersModal.tsx', [
        { from: /from\s+['"]\.\/profileService['"]/g, to: 'from "../services/profileService"' },
        { from: /from\s+['"]\.\/types['"]/g, to: 'from "../types"' }
    ]);
    await replaceInFile('src/features/profile/components/UserPosts.tsx', [
        { from: /from\s+['"]\.\/profileService['"]/g, to: 'from "../services/profileService"' }
    ]);
    
    // profile/pages
    await replaceInFile('src/features/profile/pages/EditProfile.tsx', [
        { from: /from\s+['"]\.\/profileService['"]/g, to: 'from "../services/profileService"' }
    ]);
    await replaceInFile('src/features/profile/pages/ProfilePage.tsx', [
        { from: /from\s+['"]\.\/profileService['"]/g, to: 'from "../services/profileService"' },
        { from: /from\s+['"]\.\/FollowButton['"]/g, to: 'from "../components/FollowButton"' },
        { from: /from\s+['"]\.\/UserPosts['"]/g, to: 'from "../components/UserPosts"' },
        { from: /from\s+['"]\.\/FollowersModal['"]/g, to: 'from "../components/FollowersModal"' }
    ]);
    
    // profile/services
    await replaceInFile('src/features/profile/services/profileService.ts', [
        { from: /from\s+['"]\.\/types['"]/g, to: 'from "../types"' }
    ]);
    
    // layouts
    await replaceInFile('src/layouts/MainLayout.tsx', [
        { from: /from\s+['"]\.\.\/components\/Navbar['"]/g, to: 'from "../shared/components/layout/Navbar"' },
        { from: /from\s+['"]\.\.\/components\/AuthModal['"]/g, to: 'from "../shared/components/AuthModal"' }
    ]);
}

async function scanAndFixGlobally(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (let e of entries) {
        const p = dir + '/' + e.name;
        if (e.isDirectory()) await scanAndFixGlobally(p);
        else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
            await replaceInFile(p, moves);
        }
    }
}

async function run() {
    await scanAndFixGlobally('src');
    await fixSpecific();
}

run();
