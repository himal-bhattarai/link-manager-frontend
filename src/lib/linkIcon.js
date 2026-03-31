/**
 * Returns a Simple Icons CDN URL for the given link URL's domain.
 * Falls back to null if no match — callers should show a generic icon.
 * Simple Icons slugs: https://simpleicons.org/
 */
const DOMAIN_MAP = {
  // Social
  'twitter.com':      'x',
  'x.com':            'x',
  'instagram.com':    'instagram',
  'facebook.com':     'facebook',
  'linkedin.com':     'linkedin',
  'tiktok.com':       'tiktok',
  'snapchat.com':     'snapchat',
  'pinterest.com':    'pinterest',
  'reddit.com':       'reddit',
  'discord.com':      'discord',
  'discord.gg':       'discord',
  'threads.net':      'threads',
  'mastodon.social':  'mastodon',
  'bsky.app':         'bluesky',
  'twitch.tv':        'twitch',
  // Dev
  'github.com':       'github',
  'gitlab.com':       'gitlab',
  'stackoverflow.com':'stackoverflow',
  'codepen.io':       'codepen',
  'codesandbox.io':   'codesandbox',
  'replit.com':       'replit',
  'dev.to':           'devdotto',
  'hashnode.com':     'hashnode',
  'npmjs.com':        'npm',
  'vercel.com':       'vercel',
  'netlify.com':      'netlify',
  'heroku.com':       'heroku',
  // Content
  'youtube.com':      'youtube',
  'youtu.be':         'youtube',
  'medium.com':       'medium',
  'substack.com':     'substack',
  'notion.so':        'notion',
  'notion.site':      'notion',
  'figma.com':        'figma',
  'dribbble.com':     'dribbble',
  'behance.net':      'behance',
  'producthunt.com':  'producthunt',
  'patreon.com':      'patreon',
  'ko-fi.com':        'kofi',
  'gumroad.com':      'gumroad',
  'buymeacoffee.com': 'buymeacoffee',
  'open.spotify.com': 'spotify',
  'spotify.com':      'spotify',
  'soundcloud.com':   'soundcloud',
  'apple.com':        'apple',
  'music.apple.com':  'applemusic',
  // Misc
  'linktree.com':     'linktree',
  'read.cv':          'readcv',
  'contra.com':       'contra',
  'cal.com':          'caldotcom',
  'typeform.com':     'typeform',
  'airtable.com':     'airtable',
  'zoom.us':          'zoom',
  'loom.com':         'loom',
  'whatsapp.com':     'whatsapp',
  'wa.me':            'whatsapp',
  'telegram.org':     'telegram',
  't.me':             'telegram',
  'amazon.com':       'amazon',
  'amzn.to':          'amazon',
  'etsy.com':         'etsy',
  'shopify.com':      'shopify',
  'paypal.com':       'paypal',
  'stripe.com':       'stripe',
}

export function getLinkIconUrl(url) {
  if (!url) return null
  try {
    const withProtocol = /^https?:\/\//.test(url) ? url : `https://${url}`
    const hostname = new URL(withProtocol).hostname.replace(/^www\./, '')
    // exact match
    if (DOMAIN_MAP[hostname]) {
      return `https://cdn.simpleicons.org/${DOMAIN_MAP[hostname]}/ffffff`
    }
    // subdomain match — e.g. open.spotify.com
    for (const [domain, slug] of Object.entries(DOMAIN_MAP)) {
      if (hostname.endsWith('.' + domain) || hostname === domain) {
        return `https://cdn.simpleicons.org/${slug}/ffffff`
      }
    }
  } catch {}
  return null
}
