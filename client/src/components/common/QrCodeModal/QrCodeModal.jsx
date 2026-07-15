import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./QrCodeModal.css";

function QrCodeModal({ url, onClose }) {
  const canvasRef = useRef(null);

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "recharge4me-qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="qr-modal__overlay" onClick={onClose}>
      <div className="qr-modal__card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="qr-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h3 className="qr-modal__title">Your Recharge QR Code</h3>
        <p className="qr-modal__subtitle">
          Sponsors can scan this to open your recharge link directly.
        </p>

        <div className="qr-modal__code" ref={canvasRef}>
          <QRCodeCanvas value={url} size={200} level="M" includeMargin />
        </div>

        <p className="qr-modal__url">{url}</p>

        <button
          type="button"
          className="qr-modal__download"
          onClick={handleDownload}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginRight: "0.5rem" }}
          >
            <path
              d="M12 3v12m0 0l-4-4m4 4l4-4M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download PNG
        </button>
      </div>
    </div>
  );
}

export default QrCodeModal;
