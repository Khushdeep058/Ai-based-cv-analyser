import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onFileSelected, selectedFile, label = 'PDF file', icon = 'ti ti-file-text' }) => {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) onFileSelected(acceptedFiles[0]);
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const fmt = (bytes) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

        .dz-root {
          font-family: 'DM Sans', 'Inter', sans-serif;
          border: 1.5px dashed rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.02);
          outline: none;
          position: relative;
          overflow: hidden;
          user-select: none;
        }
        .dz-root:hover {
          border-color: rgba(124,108,255,0.5);
          background: rgba(124,108,255,0.04);
        }
        .dz-root.active {
          border-color: #7c6cff;
          background: rgba(124,108,255,0.08);
          transform: scale(1.01);
        }
        .dz-root.has-file {
          border-style: solid;
          border-color: rgba(78,205,196,0.4);
          background: rgba(78,205,196,0.04);
        }
        .dz-root.has-file:hover {
          border-color: rgba(78,205,196,0.6);
          background: rgba(78,205,196,0.08);
        }
        .dz-glow {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: radial-gradient(circle at 50% 0%, rgba(124,108,255,0.12), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .dz-root.active .dz-glow { opacity: 1; }
        .dz-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          transition: background 0.2s, color 0.2s;
          border: 1px solid rgba(255,255,255,0.08);
          position: relative; z-index: 1;
        }
        .dz-icon-wrap.idle {
          background: rgba(255,255,255,0.04);
          color: #7a7a94;
        }
        .dz-icon-wrap.dragging {
          background: rgba(124,108,255,0.18);
          color: #7c6cff;
        }
        .dz-icon-wrap.done {
          background: rgba(78,205,196,0.14);
          color: #4ecdc4;
          border-color: rgba(78,205,196,0.2);
        }
        .dz-title {
          font-size: 14px;
          font-weight: 500;
          color: #e8e8f0;
          margin: 0;
          position: relative; z-index: 1;
        }
        .dz-sub {
          font-size: 12px;
          color: #7a7a94;
          margin: 0;
          font-weight: 300;
          position: relative; z-index: 1;
        }
        .dz-filename {
          font-size: 13px;
          font-weight: 500;
          color: #4ecdc4;
          margin: 0;
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: relative; z-index: 1;
        }
        .dz-filesize {
          font-size: 11px;
          color: #7a7a94;
          margin: 0;
          position: relative; z-index: 1;
        }
        .dz-replace {
          font-size: 11px;
          color: rgba(124,108,255,0.7);
          margin: 0;
          position: relative; z-index: 1;
        }
        .dz-check {
          position: absolute;
          top: 10px; right: 12px;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(78,205,196,0.15);
          border: 1px solid rgba(78,205,196,0.3);
          display: flex; align-items: center; justify-content: center;
          color: #4ecdc4;
          font-size: 11px;
        }
      `}</style>

      <div
        {...getRootProps()}
        className={`dz-root${isDragActive ? ' active' : ''}${selectedFile ? ' has-file' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dz-glow" />

        {selectedFile && (
          <div className="dz-check">
            <i className="ti ti-check" aria-hidden="true" />
          </div>
        )}

        <div className={`dz-icon-wrap ${selectedFile ? 'done' : isDragActive ? 'dragging' : 'idle'}`}>
          <i
            className={selectedFile ? 'ti ti-file-check' : isDragActive ? 'ti ti-upload' : icon}
            aria-hidden="true"
          />
        </div>

        {selectedFile ? (
          <>
            <p className="dz-filename" title={selectedFile.name}>{selectedFile.name}</p>
            <p className="dz-filesize">{fmt(selectedFile.size)}</p>
            <p className="dz-replace">Click or drop to replace</p>
          </>
        ) : (
          <>
            <p className="dz-title">
              {isDragActive ? `Drop ${label} here` : `Upload ${label}`}
            </p>
            <p className="dz-sub">Drag & drop or click · PDF only</p>
          </>
        )}
      </div>
    </>
  );
};

export default Dropzone;