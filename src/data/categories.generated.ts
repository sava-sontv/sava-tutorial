/** Auto-generated từ docs/ và _category.json. Cấu trúc: categories → sections → articles. Path: /categories/id-slug, /sections/id-slug, /articles/pathId-slug. */

export type ArticleItem = {
  title: string;
  description: string;
  path: string;
  docPath: string;
  active: boolean;
  sort: number;
};

export type SectionItem = {
  title: string;
  description: string;
  path: string;
  docPath: string;
  active: boolean;
  sort: number;
  articles: ArticleItem[];
};

export type CategoryItem = {
  title: string;
  description: string;
  path: string;
  docPath: string;
  active: boolean;
  sort: number;
  sections: SectionItem[];
};

export const categories: CategoryItem[] = [
  { title: 'getting-started', description: 'Articles in Getting Started', path: '/categories/1443555064-getting-started', docPath: '/docs/getting-started', active: true, sort: 5, sections: [
    { title: 'introduction-to-savrse', description: 'Articles in Introduction To Savrse', path: '/sections/1950491387-introduction-to-savrse', docPath: '/docs/getting-started/introduction-to-savrse', active: true, sort: 5, articles: [
      { title: 'what-is-savrse', description: 'Article: What Is Savrse', path: '/articles/961964138-what-is-savrse', docPath: '/docs/getting-started/introduction-to-savrse/what-is-savrse', active: true, sort: 5 },
      { title: 'supported-devices-and-system-requirements', description: 'Article: Supported Devices And System Requirements', path: '/articles/434138007-supported-devices-and-system-requirements', docPath: '/docs/getting-started/introduction-to-savrse/supported-devices-and-system-requirements', active: true, sort: 10 },
      { title: 'how-the-community-and-vr-app-work-together', description: 'Article: How The Community And Vr App Work Together', path: '/articles/1998028660-how-the-community-and-vr-app-work-together', docPath: '/docs/getting-started/introduction-to-savrse/how-the-community-and-vr-app-work-together', active: true, sort: 15 },
    ] },
    { title: 'onboarding-and-vr-basic', description: 'Articles in Onboarding And Vr Basic', path: '/sections/1173100421-onboarding-and-vr-basic', docPath: '/docs/getting-started/onboarding-and-vr-basic', active: true, sort: 10, articles: [
      { title: 'basic-controls-and-navigation-in-world', description: 'Article: Basic Controls And Navigation In World', path: '/articles/2076871477-basic-controls-and-navigation-in-world', docPath: '/docs/getting-started/onboarding-and-vr-basic/basic-controls-and-navigation-in-world', active: true, sort: 999 },
    ] },
  ] },
  { title: 'account-and-login-issues', description: 'Articles in Account & Login Issues', path: '/categories/507210629-account-and-login-issues', docPath: '/docs/account-and-login-issues', active: true, sort: 10, sections: [
    { title: 'account-creation-and-management', description: 'Articles in Account Creation And Management', path: '/sections/1863623431-account-creation-and-management', docPath: '/docs/account-and-login-issues/account-creation-and-management', active: true, sort: 5, articles: [
      { title: 'creating-your-account', description: 'Article: Creating Your Account', path: '/articles/89955033-creating-your-account', docPath: '/docs/account-and-login-issues/account-creation-and-management/creating-your-account', active: true, sort: 5 },
      { title: 'changing-your-password', description: 'Article: Changing Your Password', path: '/articles/2071120277-changing-your-password', docPath: '/docs/account-and-login-issues/account-creation-and-management/changing-your-password', active: true, sort: 10 },
      { title: 'using-a-guest-account-on-the-vr-app', description: 'Article: Using A Guest Account On The Vr App', path: '/articles/501440432-using-a-guest-account-on-the-vr-app', docPath: '/docs/account-and-login-issues/account-creation-and-management/using-a-guest-account-on-the-vr-app', active: true, sort: 15 },
    ] },
    { title: 'login-and-password-troubleshooting', description: 'Articles in Login And Password Troubleshooting', path: '/sections/822864318-login-and-password-troubleshooting', docPath: '/docs/account-and-login-issues/login-and-password-troubleshooting', active: true, sort: 10, articles: [
      { title: 'i-forgot-my-password', description: 'Article: I Forgot My Password', path: '/articles/1614592554-i-forgot-my-password', docPath: '/docs/account-and-login-issues/login-and-password-troubleshooting/i-forgot-my-password', active: true, sort: 5 },
      { title: 'i-didnt-receive-the-password-reset-email', description: 'Article: I Didnt Receive The Password Reset Email', path: '/articles/348068126-i-didnt-receive-the-password-reset-email', docPath: '/docs/account-and-login-issues/login-and-password-troubleshooting/i-didnt-receive-the-password-reset-email', active: true, sort: 10 },
      { title: 'i-forgot-which-email-i-used', description: 'Article: I Forgot Which Email I Used', path: '/articles/1043441192-i-forgot-which-email-i-used', docPath: '/docs/account-and-login-issues/login-and-password-troubleshooting/i-forgot-which-email-i-used', active: true, sort: 15 },
      { title: 'logging-in-by-code-failed', description: 'Article: Logging In By Code Failed', path: '/articles/1003638175-logging-in-by-code-failed', docPath: '/docs/account-and-login-issues/login-and-password-troubleshooting/logging-in-by-code-failed', active: true, sort: 20 },
    ] },
  ] },
  { title: 'technical-support', description: 'Articles in Technical Support', path: '/categories/919467359-technical-support', docPath: '/docs/technical-support', active: true, sort: 15, sections: [
    { title: 'connection-issues', description: 'Articles in Connection Issues', path: '/sections/1497794697-connection-issues', docPath: '/docs/technical-support/connection-issues', active: true, sort: 5, articles: [
      { title: 'vr-app-cannot-connect-to-server', description: 'Article: Vr App Cannot Connect To Server', path: '/articles/871796173-vr-app-cannot-connect-to-server', docPath: '/docs/technical-support/connection-issues/vr-app-cannot-connect-to-server', active: true, sort: 5 },
      { title: 'worlds-not-loading-infinite-loading-screen', description: 'Article: Worlds Not Loading Infinite Loading Screen', path: '/articles/252887248-worlds-not-loading-infinite-loading-screen', docPath: '/docs/technical-support/connection-issues/worlds-not-loading-infinite-loading-screen', active: true, sort: 10 },
      { title: 'high-ping-or-lag-inside-worlds', description: 'Article: High Ping Or Lag Inside Worlds', path: '/articles/677776269-high-ping-or-lag-inside-worlds', docPath: '/docs/technical-support/connection-issues/high-ping-or-lag-inside-worlds', active: true, sort: 15 },
      { title: 'voice-chat-not-working-due-to-network-restrictions', description: 'Article: Voice Chat Not Working Due To Network Restrictions', path: '/articles/2097831810-voice-chat-not-working-due-to-network-restrictions', docPath: '/docs/technical-support/connection-issues/voice-chat-not-working-due-to-network-restrictions', active: true, sort: 20 },
      { title: 'community-fail-to-load-data', description: 'Article: Community Fail To Load Data', path: '/articles/286292873-community-fail-to-load-data', docPath: '/docs/technical-support/connection-issues/community-fail-to-load-data', active: true, sort: 25 },
    ] },
    { title: 'audio-problems', description: 'Articles in Audio Problems', path: '/sections/1778936267-audio-problems', docPath: '/docs/technical-support/audio-problems', active: true, sort: 10, articles: [
      { title: 'no-in-game-sound', description: 'Article: No In Game Sound', path: '/articles/9135359-no-in-game-sound', docPath: '/docs/technical-support/audio-problems/no-in-game-sound', active: true, sort: 5 },
      { title: 'microphone-not-working', description: 'Article: Microphone Not Working', path: '/articles/691504860-microphone-not-working', docPath: '/docs/technical-support/audio-problems/microphone-not-working', active: true, sort: 10 },
      { title: 'audio-cutting-out-or-distorted', description: 'Article: Audio Cutting Out Or Distorted', path: '/articles/1457048354-audio-cutting-out-or-distorted', docPath: '/docs/technical-support/audio-problems/audio-cutting-out-or-distorted', active: true, sort: 15 },
    ] },
    { title: 'performance-issues', description: 'Articles in Performance Issues', path: '/sections/974337783-performance-issues', docPath: '/docs/technical-support/performance-issues', active: true, sort: 15, articles: [
      { title: 'low-fps-or-graphics-lag', description: 'Article: Low Fps Or Graphics Lag', path: '/articles/789766963-low-fps-or-graphics-lag', docPath: '/docs/technical-support/performance-issues/low-fps-or-graphics-lag', active: true, sort: 5 },
      { title: 'app-crashes-or-not-responding', description: 'Article: App Crashes Or Not Responding', path: '/articles/251271763-app-crashes-or-not-responding', docPath: '/docs/technical-support/performance-issues/app-crashes-or-not-responding', active: true, sort: 10 },
      { title: 'overheating-or-battery-drain', description: 'Article: Overheating Or Battery Drain', path: '/articles/1669142813-overheating-or-battery-drain', docPath: '/docs/technical-support/performance-issues/overheating-or-battery-drain', active: true, sort: 15 },
      { title: 'world-takes-too-long-to-load', description: 'Article: World Takes Too Long To Load', path: '/articles/2033881596-world-takes-too-long-to-load', docPath: '/docs/technical-support/performance-issues/world-takes-too-long-to-load', active: true, sort: 20 },
    ] },
    { title: 'hardware-and-device-support', description: 'Articles in Hardware And Device Support', path: '/sections/1337219565-hardware-and-device-support', docPath: '/docs/technical-support/hardware-and-device-support', active: true, sort: 20, articles: [
      { title: 'controller-or-tracking-issues', description: 'Article: Controller Or Tracking Issues', path: '/articles/1196193673-controller-or-tracking-issues', docPath: '/docs/technical-support/hardware-and-device-support/controller-or-tracking-issues', active: true, sort: 5 },
      { title: 'device-compatibility-and-setup', description: 'Article: Device Compatibility And Setup', path: '/articles/2050196969-device-compatibility-and-setup', docPath: '/docs/technical-support/hardware-and-device-support/device-compatibility-and-setup', active: true, sort: 10 },
      { title: 'vr-headset-troubleshooting', description: 'Article: Vr Headset Troubleshooting', path: '/articles/1424165118-vr-headset-troubleshooting', docPath: '/docs/technical-support/hardware-and-device-support/vr-headset-troubleshooting', active: true, sort: 15 },
    ] },
  ] },
  { title: 'exploring-and-socializing', description: 'Articles in Exploring & Socializing', path: '/categories/1854124576-exploring-and-socializing', docPath: '/docs/exploring-and-socializing', active: true, sort: 20, sections: [
    { title: 'finding-and-joining-worlds', description: 'Articles in Finding And Joining Worlds', path: '/sections/413642640-finding-and-joining-worlds', docPath: '/docs/exploring-and-socializing/finding-and-joining-worlds', active: true, sort: 5, articles: [
      { title: 'browsing-and-joining-worlds', description: 'Article: Browsing And Joining Worlds', path: '/articles/1844956562-browsing-and-joining-worlds', docPath: '/docs/exploring-and-socializing/finding-and-joining-worlds/browsing-and-joining-worlds', active: true, sort: 5 },
      { title: 'switching-between-worlds', description: 'Article: Switching Between Worlds', path: '/articles/1858675717-switching-between-worlds', docPath: '/docs/exploring-and-socializing/finding-and-joining-worlds/switching-between-worlds', active: true, sort: 10 },
    ] },
    { title: 'social-features', description: 'Articles in Social Features', path: '/sections/698047133-social-features', docPath: '/docs/exploring-and-socializing/social-features', active: true, sort: 10, articles: [
      { title: 'using-voice-chat-and-communication', description: 'Article: Using Voice Chat And Communication', path: '/articles/1732710459-using-voice-chat-and-communication', docPath: '/docs/exploring-and-socializing/social-features/using-voice-chat-and-communication', active: true, sort: 5 },
      { title: 'emotes-and-self-gestures', description: 'Article: Emotes And Self Gestures', path: '/articles/2067210013-emotes-and-self-gestures', docPath: '/docs/exploring-and-socializing/social-features/emotes-and-self-gestures', active: true, sort: 10 },
    ] },
  ] },
  { title: 'community-and-safety', description: 'Articles in Community & Safety', path: '/categories/1440195651-community-and-safety', docPath: '/docs/community-and-safety', active: true, sort: 25, sections: [
    { title: 'community-guidelines', description: 'Articles in Community Guidelines', path: '/sections/167047655-community-guidelines', docPath: '/docs/community-and-safety/community-guidelines', active: true, sort: 5, articles: [
      { title: 'savrse-code-of-conduct', description: 'Article: Savrse Code Of Conduct', path: '/articles/544249667-savrse-code-of-conduct', docPath: '/docs/community-and-safety/community-guidelines/savrse-code-of-conduct', active: true, sort: 5 },
      { title: 'chat-etiquette-and-harassment-policy', description: 'Article: Chat Etiquette And Harassment Policy', path: '/articles/958646571-chat-etiquette-and-harassment-policy', docPath: '/docs/community-and-safety/community-guidelines/chat-etiquette-and-harassment-policy', active: true, sort: 10 },
      { title: 'savrse-community-standards', description: 'Article: Savrse Community Standards', path: '/articles/1670989183-savrse-community-standards', docPath: '/docs/community-and-safety/community-guidelines/savrse-community-standards', active: true, sort: 15 },
    ] },
    { title: 'reporting-and-moderation', description: 'Articles in Reporting And Moderation', path: '/sections/1020125093-reporting-and-moderation', docPath: '/docs/community-and-safety/reporting-and-moderation', active: true, sort: 10, articles: [
      { title: 'reporting-players-or-content', description: 'Article: Reporting Players Or Content', path: '/articles/450086793-reporting-players-or-content', docPath: '/docs/community-and-safety/reporting-and-moderation/reporting-players-or-content', active: true, sort: 5 },
      { title: 'understanding-bans-and-suspension', description: 'Article: Understanding Bans And Suspension', path: '/articles/224458048-understanding-bans-and-suspension', docPath: '/docs/community-and-safety/reporting-and-moderation/understanding-bans-and-suspension', active: true, sort: 10 },
      { title: 'appealing-an-account-ban', description: 'Article: Appealing An Account Ban', path: '/articles/1031005207-appealing-an-account-ban', docPath: '/docs/community-and-safety/reporting-and-moderation/appealing-an-account-ban', active: true, sort: 15 },
    ] },
  ] },
  { title: 'creating-in-savrse', description: 'Articles in Creating In Savrse', path: '/categories/682308368-creating-in-savrse', docPath: '/docs/creating-in-savrse', active: true, sort: 30, sections: [
    { title: 'world-creation-basics', description: 'Articles in World Creation Basics', path: '/sections/558056328-world-creation-basics', docPath: '/docs/creating-in-savrse/world-creation-basics', active: true, sort: 5, articles: [
      { title: 'installing-savrse-studio', description: 'Article: Installing Savrse Studio', path: '/articles/606078847-installing-savrse-studio', docPath: '/docs/creating-in-savrse/world-creation-basics/installing-savrse-studio', active: true, sort: 5 },
      { title: 'creating-your-first-world', description: 'Article: Creating Your First World', path: '/articles/791475153-creating-your-first-world', docPath: '/docs/creating-in-savrse/world-creation-basics/creating-your-first-world', active: true, sort: 10 },
      { title: 'understanding-triangles-and-project-limits-in-savrse-studio', description: 'Article: Understanding Triangles And Project Limits In Savrse Studio', path: '/articles/654614817-understanding-triangles-and-project-limits-in-savrse-studio', docPath: '/docs/creating-in-savrse/world-creation-basics/understanding-triangles-and-project-limits-in-savrse-studio', active: true, sort: 999 },
    ] },
    { title: 'creation-policies-and-guidelines', description: 'Articles in Creation Policies And Guidelines', path: '/sections/404268952-creation-policies-and-guidelines', docPath: '/docs/creating-in-savrse/creation-policies-and-guidelines', active: true, sort: 10, articles: [
      { title: 'world-content-guidelines', description: 'Article: World Content Guidelines', path: '/articles/314567026-world-content-guidelines', docPath: '/docs/creating-in-savrse/creation-policies-and-guidelines/world-content-guidelines', active: true, sort: 5 },
      { title: 'safety-and-moderation-requirements', description: 'Article: Safety And Moderation Requirements', path: '/articles/255877084-safety-and-moderation-requirements', docPath: '/docs/creating-in-savrse/creation-policies-and-guidelines/safety-and-moderation-requirements', active: true, sort: 10 },
      { title: 'publishing-standards-and-quality-requirements', description: 'Article: Publishing Standards And Quality Requirements', path: '/articles/567779505-publishing-standards-and-quality-requirements', docPath: '/docs/creating-in-savrse/creation-policies-and-guidelines/publishing-standards-and-quality-requirements', active: true, sort: 15 },
    ] },
  ] },
  { title: 'marketplace-and-savax', description: 'Articles in Marketplace And Savax', path: '/categories/1499416999-marketplace-and-savax', docPath: '/docs/marketplace-and-savax', active: true, sort: 30, sections: [
    { title: 'marketplace-basics', description: 'Articles in Marketplace Basics', path: '/sections/2107209671-marketplace-basics', docPath: '/docs/marketplace-and-savax/marketplace-basics', active: true, sort: 5, articles: [
      { title: 'savrse-marketplace', description: 'Article: Savrse Marketplace', path: '/articles/682358950-savrse-marketplace', docPath: '/docs/marketplace-and-savax/marketplace-basics/savrse-marketplace', active: true, sort: 999 },
      { title: 'what-is-savax', description: 'Article: What Is Savax', path: '/articles/585220955-what-is-savax', docPath: '/docs/marketplace-and-savax/marketplace-basics/what-is-savax', active: true, sort: 999 },
    ] },
  ] },
];
