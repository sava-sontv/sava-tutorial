// Sidebars: generated từ _category.json và _articles.json (3 cấp: Category → Topic → Articles)
// Sửa active/sort trong các file JSON → chạy yarn generate-sidebar (hoặc yarn dev tự chạy)
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
  {
    "type": "category",
    "label": "Getting Started",
    "items": [
      {
        "type": "category",
        "label": "Introduction To Savrse",
        "items": [
          "getting-started/introduction-to-savrse/what-is-savrse",
          "getting-started/introduction-to-savrse/supported-devices-system-requirements",
          "getting-started/introduction-to-savrse/how-the-community-and-vr-app-work-together"
        ],
        "collapsed": false,
        "key": "getting-started-introduction-to-savrse",
        "link": {
          "type": "generated-index",
          "title": "Introduction To Savrse",
          "slug": "getting-started/introduction-to-savrse",
          "description": "Articles in Introduction To Savrse"
        }
      },
      {
        "type": "category",
        "label": "Onboarding And Vr Basic",
        "items": [
          "getting-started/onboarding-and-vr-basic/basic-controls-navigation-in-world"
        ],
        "collapsed": false,
        "key": "getting-started-onboarding-and-vr-basic",
        "link": {
          "type": "generated-index",
          "title": "Onboarding And Vr Basic",
          "slug": "getting-started/onboarding-and-vr-basic",
          "description": "Articles in Onboarding And Vr Basic"
        }
      }
    ],
    "collapsed": false,
    "key": "getting-started",
    "link": {
      "type": "generated-index",
      "title": "Getting Started",
      "slug": "getting-started",
      "description": "Articles in Getting Started"
    }
  },
  {
    "type": "category",
    "label": "Account & Login Issues",
    "items": [
      {
        "type": "category",
        "label": "Account Creation And Management",
        "items": [
          "account-and-login-issues/account-creation-and-management/creating-your-account",
          "account-and-login-issues/account-creation-and-management/changing-your-password",
          "account-and-login-issues/account-creation-and-management/using-a-guest-account-on-the-vr-app"
        ],
        "collapsed": false,
        "key": "account-and-login-issues-account-creation-and-management",
        "link": {
          "type": "generated-index",
          "title": "Account Creation And Management",
          "slug": "account-and-login-issues/account-creation-and-management",
          "description": "Articles in Account Creation And Management"
        }
      },
      {
        "type": "category",
        "label": "Login And Password Troubleshooting",
        "items": [
          "account-and-login-issues/login-and-password-troubleshooting/i-forgot-my-password",
          "account-and-login-issues/login-and-password-troubleshooting/i-did-not-receive-the-password-reset-email",
          "account-and-login-issues/login-and-password-troubleshooting/i-forgot-which-email-i-used",
          "account-and-login-issues/login-and-password-troubleshooting/logging-in-by-code-failed",
          "account-and-login-issues/login-and-password-troubleshooting/how-to-login-to-savrse-vr-pc-app-using-vr-code"
        ],
        "collapsed": false,
        "key": "account-and-login-issues-login-and-password-troubleshooting",
        "link": {
          "type": "generated-index",
          "title": "Login And Password Troubleshooting",
          "slug": "account-and-login-issues/login-and-password-troubleshooting",
          "description": "Articles in Login And Password Troubleshooting"
        }
      }
    ],
    "collapsed": false,
    "key": "account-and-login-issues",
    "link": {
      "type": "generated-index",
      "title": "Account & Login Issues",
      "slug": "account-and-login-issues",
      "description": "Articles in Account & Login Issues"
    }
  },
  {
    "type": "category",
    "label": "Technical Support",
    "items": [
      {
        "type": "category",
        "label": "Connection Issues",
        "items": [
          "technical-support/connection-issues/3-1-1-vr-app-cannot-connect-to-server",
          "technical-support/connection-issues/3-1-2-worlds-not-loading-infinite-loading-screen",
          "technical-support/connection-issues/3-1-3-high-ping-or-lag-inside-worlds",
          "technical-support/connection-issues/3-1-4-voice-chat-not-working-due-to-network-restrictions",
          "technical-support/connection-issues/3-1-5-community-fails-to-load-data"
        ],
        "collapsed": false,
        "key": "technical-support-connection-issues",
        "link": {
          "type": "generated-index",
          "title": "Connection Issues",
          "slug": "technical-support/connection-issues",
          "description": "Articles in Connection Issues"
        }
      },
      {
        "type": "category",
        "label": "Audio Problems",
        "items": [
          "technical-support/audio-problems/3-2-1-no-in-game-sound",
          "technical-support/audio-problems/3-2-2-microphone-not-working",
          "technical-support/audio-problems/3-2-3-audio-cutting-out-or-distorted"
        ],
        "collapsed": false,
        "key": "technical-support-audio-problems",
        "link": {
          "type": "generated-index",
          "title": "Audio Problems",
          "slug": "technical-support/audio-problems",
          "description": "Articles in Audio Problems"
        }
      },
      {
        "type": "category",
        "label": "Performance Issues",
        "items": [
          "technical-support/performance-issues/3-3-1-low-fps-or-graphics-lag",
          "technical-support/performance-issues/app-crashes-or-not-responding",
          "technical-support/performance-issues/overheating-or-battery-drain",
          "technical-support/performance-issues/world-takes-too-long-to-load"
        ],
        "collapsed": false,
        "key": "technical-support-performance-issues",
        "link": {
          "type": "generated-index",
          "title": "Performance Issues",
          "slug": "technical-support/performance-issues",
          "description": "Articles in Performance Issues"
        }
      },
      {
        "type": "category",
        "label": "Hardware And Device Support",
        "items": [
          "technical-support/hardware-and-device-support/controller-or-tracking-issues",
          "technical-support/hardware-and-device-support/device-compatibility-setup",
          "technical-support/hardware-and-device-support/vr-headset-troubleshooting"
        ],
        "collapsed": false,
        "key": "technical-support-hardware-and-device-support",
        "link": {
          "type": "generated-index",
          "title": "Hardware And Device Support",
          "slug": "technical-support/hardware-and-device-support",
          "description": "Articles in Hardware And Device Support"
        }
      }
    ],
    "collapsed": false,
    "key": "technical-support",
    "link": {
      "type": "generated-index",
      "title": "Technical Support",
      "slug": "technical-support",
      "description": "Articles in Technical Support"
    }
  },
  {
    "type": "category",
    "label": "Exploring & Socializing",
    "items": [
      {
        "type": "category",
        "label": "Finding And Joining Worlds",
        "items": [
          "exploring-and-socializing/finding-and-joining-worlds/browsing-and-joining-worlds",
          "exploring-and-socializing/finding-and-joining-worlds/switching-between-worlds"
        ],
        "collapsed": false,
        "key": "exploring-and-socializing-finding-and-joining-worlds",
        "link": {
          "type": "generated-index",
          "title": "Finding And Joining Worlds",
          "slug": "exploring-and-socializing/finding-and-joining-worlds",
          "description": "Articles in Finding And Joining Worlds"
        }
      },
      {
        "type": "category",
        "label": "Social Features",
        "items": [
          "exploring-and-socializing/social-features/using-voice-chat-communication",
          "exploring-and-socializing/social-features/emotes-and-self-gestures"
        ],
        "collapsed": false,
        "key": "exploring-and-socializing-social-features",
        "link": {
          "type": "generated-index",
          "title": "Social Features",
          "slug": "exploring-and-socializing/social-features",
          "description": "Articles in Social Features"
        }
      }
    ],
    "collapsed": false,
    "key": "exploring-and-socializing",
    "link": {
      "type": "generated-index",
      "title": "Exploring & Socializing",
      "slug": "exploring-and-socializing",
      "description": "Articles in Exploring & Socializing"
    }
  },
  {
    "type": "category",
    "label": "Community & Safety",
    "items": [
      {
        "type": "category",
        "label": "Community Guidelines",
        "items": [
          "community-and-safety/community-guidelines/savrse-code-of-conduct",
          "community-and-safety/community-guidelines/chat-etiquette-harassment-policy",
          "community-and-safety/community-guidelines/savrse-community-standards"
        ],
        "collapsed": false,
        "key": "community-and-safety-community-guidelines",
        "link": {
          "type": "generated-index",
          "title": "Community Guidelines",
          "slug": "community-and-safety/community-guidelines",
          "description": "Articles in Community Guidelines"
        }
      },
      {
        "type": "category",
        "label": "Reporting And Moderation",
        "items": [
          "community-and-safety/reporting-and-moderation/reporting-players-or-content",
          "community-and-safety/reporting-and-moderation/understanding-bans-and-suspensions",
          "community-and-safety/reporting-and-moderation/appealing-an-account-ban"
        ],
        "collapsed": false,
        "key": "community-and-safety-reporting-and-moderation",
        "link": {
          "type": "generated-index",
          "title": "Reporting And Moderation",
          "slug": "community-and-safety/reporting-and-moderation",
          "description": "Articles in Reporting And Moderation"
        }
      }
    ],
    "collapsed": false,
    "key": "community-and-safety",
    "link": {
      "type": "generated-index",
      "title": "Community & Safety",
      "slug": "community-and-safety",
      "description": "Articles in Community & Safety"
    }
  },
  {
    "type": "category",
    "label": "Creating In Savrse",
    "items": [
      {
        "type": "category",
        "label": "World Creation Basics",
        "items": [
          "creating-in-savrse/world-creation-basics/installing-savrse-studio",
          "creating-in-savrse/world-creation-basics/creating-your-first-world",
          "creating-in-savrse/world-creation-basics/understanding-triangles-and-project-limits-in-savrse-studio"
        ],
        "collapsed": false,
        "key": "creating-in-savrse-world-creation-basics",
        "link": {
          "type": "generated-index",
          "title": "World Creation Basics",
          "slug": "creating-in-savrse/world-creation-basics",
          "description": "Articles in World Creation Basics"
        }
      },
      {
        "type": "category",
        "label": "Creation Policies And Guidelines",
        "items": [
          "creating-in-savrse/creation-policies-and-guidelines/world-content-guidelines",
          "creating-in-savrse/creation-policies-and-guidelines/safety-moderation-requirements",
          "creating-in-savrse/creation-policies-and-guidelines/publishing-standards-quality-requirements"
        ],
        "collapsed": false,
        "key": "creating-in-savrse-creation-policies-and-guidelines",
        "link": {
          "type": "generated-index",
          "title": "Creation Policies And Guidelines",
          "slug": "creating-in-savrse/creation-policies-and-guidelines",
          "description": "Articles in Creation Policies And Guidelines"
        }
      }
    ],
    "collapsed": false,
    "key": "creating-in-savrse",
    "link": {
      "type": "generated-index",
      "title": "Creating In Savrse",
      "slug": "creating-in-savrse",
      "description": "Articles in Creating In Savrse"
    }
  },
  {
    "type": "category",
    "label": "Marketplace And Savax",
    "items": [
      {
        "type": "category",
        "label": "Marketplace Basics",
        "items": [
          "marketplace-and-savax/marketplace-basics/savrse-marketplace",
          "marketplace-and-savax/marketplace-basics/what-is-savax"
        ],
        "collapsed": false,
        "key": "marketplace-and-savax-marketplace-basics",
        "link": {
          "type": "generated-index",
          "title": "Marketplace Basics",
          "slug": "marketplace-and-savax/marketplace-basics",
          "description": "Articles in Marketplace Basics"
        }
      }
    ],
    "collapsed": false,
    "key": "marketplace-and-savax",
    "link": {
      "type": "generated-index",
      "title": "Marketplace And Savax",
      "slug": "marketplace-and-savax",
      "description": "Articles in Marketplace And Savax"
    }
  }
],
};
module.exports = sidebars;
// touched 1786699432616
