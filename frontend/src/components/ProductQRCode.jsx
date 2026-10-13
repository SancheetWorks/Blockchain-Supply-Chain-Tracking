import { QRCodeCanvas } from 'qrcode.react'

function ProductQRCode({ productId }) {

    const trackingUrl =
        `http://localhost:5173/track?product=${encodeURIComponent(productId)}`

    function downloadQRCode() {

        const canvas = document.getElementById(
            `qr-code-${productId}`
        )

        if (!canvas) {
            return
        }

        const image = canvas.toDataURL('image/png')

        const link = document.createElement('a')

        link.href = image
        link.download = `product-${productId}-qr.png`

        link.click()
    }

    return (
        <div className="text-center">

            <div className="d-flex justify-content-center">

                <QRCodeCanvas
                    id={`qr-code-${productId}`}
                    value={trackingUrl}
                    size={250}
                    level="H"
                    includeMargin={true}
                />

            </div>

            <h5 className="fw-bold mt-3">
                Product QR Code
            </h5>

            <p className="mb-1">
                Product ID: <strong>{productId}</strong>
            </p>

            <p className="text-secondary">
                Scan this QR code to track the product.
            </p>

            <button
                type="button"
                className="btn btn-primary mt-2"
                onClick={downloadQRCode}
            >
                <i className="bi bi-download me-2"></i>
                Download QR
            </button>

        </div>
    )
}

export default ProductQRCode