interface SoundToggleProps {
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
}

function SoundToggle({ isEnabled, onToggle }: SoundToggleProps) {
  return (
    <button 
      className={`sound-toggle ${isEnabled ? 'enabled' : ''}`}
      onClick={() => onToggle(!isEnabled)}
      aria-label={isEnabled ? '关闭音效' : '开启音效'}
    >
      <svg 
        className="sound-icon" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {isEnabled ? (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </>
        ) : (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </>
        )}
      </svg>
    </button>
  )
}

export default SoundToggle