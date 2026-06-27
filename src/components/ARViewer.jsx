import { useCallback, useEffect, useRef, useState } from 'react'
import { SAMPLE_FRAME } from '../constants'

const AR_WIDTHS = { small: 160, medium: 220, large: 280 }

export default function ARViewer({ imageUrl, sizeLabel, sizeKey, onClose }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const dragRef = useRef(null)
  const pinchRef = useRef(null)

  useEffect(() => {
    let stream = null

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        setError('Camera access is required for AR view. Please allow camera permission.')
      }
    }

    startCamera()
    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      dragRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        originX: position.x,
        originY: position.y,
      }
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinchRef.current = {
        startDist: Math.hypot(dx, dy),
        startScale: scale,
      }
      dragRef.current = null
    }
  }, [position, scale])

  const onTouchMove = useCallback((e) => {
    e.preventDefault()
    if (e.touches.length === 1 && dragRef.current) {
      const dx = e.touches[0].clientX - dragRef.current.startX
      const dy = e.touches[0].clientY - dragRef.current.startY
      setPosition({
        x: dragRef.current.originX + dx,
        y: dragRef.current.originY + dy,
      })
    } else if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const ratio = dist / pinchRef.current.startDist
      setScale(Math.min(2.5, Math.max(0.4, pinchRef.current.startScale * ratio)))
    }
  }, [])

  const onTouchEnd = useCallback(() => {
    dragRef.current = null
    pinchRef.current = null
  }, [])

  return (
    <div className="ar-overlay" ref={containerRef}>
      <video
        ref={videoRef}
        className="ar-video"
        autoPlay
        playsInline
        muted
      />

      <div
        className="ar-frame-wrapper"
        style={{
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="ar-frame"
          style={{
            width: AR_WIDTHS[sizeKey] || 220,
            borderColor: SAMPLE_FRAME.color,
            boxShadow: `0 12px 40px rgba(0,0,0,0.45), inset 0 0 0 3px ${SAMPLE_FRAME.borderColor}`,
          }}
        >
          <img src={imageUrl} alt="Framed artwork" className="ar-frame-image" />
        </div>
        <span className="ar-size-badge">{sizeLabel}</span>
      </div>

      <div className="ar-top-bar">
        <button type="button" className="ar-close" onClick={onClose}>
          ✕ Close
        </button>
        <span className="ar-title">View in Your Room</span>
      </div>

      <p className="ar-hint">Drag to move · Pinch to resize</p>

      {error && <div className="ar-error">{error}</div>}
    </div>
  )
}
