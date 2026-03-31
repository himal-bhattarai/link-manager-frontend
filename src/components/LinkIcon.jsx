import { useState } from 'react'
import { Link2 } from 'lucide-react'
import { getLinkIconUrl } from '../lib/linkIcon'

/**
 * Shows a brand icon for the URL if recognised, else a generic Link2 icon.
 * size: pixel size of the icon container
 */
export default function LinkIcon({ url, size = 16 }) {
  const iconUrl = getLinkIconUrl(url)
  const [errored, setErrored] = useState(false)

  if (iconUrl && !errored) {
    return (
      <img
        src={iconUrl}
        alt=""
        width={size}
        height={size}
        onError={() => setErrored(true)}
        style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0, opacity: 0.85 }}
      />
    )
  }

  return <Link2 size={size} style={{ flexShrink: 0, opacity: 0.6 }} />
}
