import { useRef, useState } from 'react'
import Frame3DViewer from './components/Frame3DViewer'
import ARViewer from './components/ARViewer'
import { useIsMobile } from './hooks/useIsMobile'
import {
  FRAME_SIZES,
  SAMPLE_FRAME,
  SAMPLE_PICTURES,
} from './constants'
import './App.css'

function App() {
  const isMobile = useIsMobile()
  const fileInputRef = useRef(null)
  const [pictureUrl, setPictureUrl] = useState(SAMPLE_PICTURES[0].url)
  const [sizeKey, setSizeKey] = useState('medium')
  const [viewMode, setViewMode] = useState('3d')
  const [customLabel, setCustomLabel] = useState('Nature')

  const size = FRAME_SIZES[sizeKey]

  function handlePictureSelect(url, label) {
    setPictureUrl(url)
    setCustomLabel(label)
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPictureUrl(url)
    setCustomLabel('Your Photo')
  }

  function openAR() {
    if (isMobile) setViewMode('ar')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1>FrameCraft Studio</h1>
          <p>Design your perfect picture frame — demo showcase</p>
        </div>
      </header>

      <main className="main">
        <aside className="controls">
          <section className="control-section">
            <h2>1. Choose Picture</h2>
            <div className="picture-grid">
              {SAMPLE_PICTURES.map((pic) => (
                <button
                  key={pic.id}
                  type="button"
                  className={`picture-thumb ${pictureUrl === pic.url ? 'active' : ''}`}
                  onClick={() => handlePictureSelect(pic.url, pic.label)}
                >
                  <img src={pic.url} alt={pic.label} />
                  <span>{pic.label}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Your Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileUpload}
            />
          </section>

          <section className="control-section">
            <h2>2. Select Frame</h2>
            <div className="frame-option active">
              <div
                className="frame-swatch"
                style={{ background: SAMPLE_FRAME.color }}
              />
              <div>
                <strong>{SAMPLE_FRAME.name}</strong>
                <span>Elegant gold finish</span>
              </div>
            </div>
          </section>

          <section className="control-section">
            <h2>3. Frame Size</h2>
            <div className="size-options">
              {Object.entries(FRAME_SIZES).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  className={`size-btn ${sizeKey === key ? 'active' : ''}`}
                  onClick={() => setSizeKey(key)}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </section>

          {isMobile && (
            <section className="control-section ar-section">
              <h2>4. View in Room</h2>
              <button type="button" className="ar-launch-btn" onClick={openAR}>
                📷 Open AR Camera View
              </button>
              <p className="ar-note">Mobile only — see the frame on your wall</p>
            </section>
          )}
        </aside>

        <section className="preview">
          <div className="preview-header">
            <h2>Preview</h2>
            <div className="preview-meta">
              <span>{SAMPLE_FRAME.name}</span>
              <span>·</span>
              <span>{size.label}</span>
              <span>·</span>
              <span>{customLabel}</span>
            </div>
            {isMobile && (
              <div className="view-tabs">
                <button
                  type="button"
                  className={viewMode === '3d' ? 'active' : ''}
                  onClick={() => setViewMode('3d')}
                >
                  3D View
                </button>
                <button
                  type="button"
                  className={viewMode === 'ar' ? 'active' : ''}
                  onClick={() => setViewMode('ar')}
                >
                  AR Camera
                </button>
              </div>
            )}
          </div>

          {viewMode === '3d' && (
            <Frame3DViewer
              imageUrl={pictureUrl}
              width={size.width}
              height={size.height}
            />
          )}
        </section>
      </main>

      {viewMode === 'ar' && isMobile && (
        <ARViewer
          imageUrl={pictureUrl}
          sizeLabel={size.label}
          sizeKey={sizeKey}
          onClose={() => setViewMode('3d')}
        />
      )}

      <footer className="footer">
        <p>FrameCraft Studio — Picture Frame Store Demo</p>
      </footer>
    </div>
  )
}

export default App
