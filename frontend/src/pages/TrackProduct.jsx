import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

function TrackProduct() {

    const [searchParams] = useSearchParams()

    const [productId, setProductId] = useState('')
    const [productData, setProductData] = useState(null)

    const [loading, setLoading] = useState(false)
    const [searchError, setSearchError] = useState('')

    async function fetchProduct(productCode) {

        if (!productCode) {
            return
        }

        setLoading(true)
        setSearchError('')
        setProductData(null)

        try {

            const response = await fetch(
                `http://localhost:5000/api/products/track/${encodeURIComponent(productCode)}`
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to fetch product'
                )
            }

            setProductData(data)

        } catch (error) {

            console.error(error)

            setSearchError(
                error.message || 'Unable to fetch product information'
            )

        } finally {

            setLoading(false)

        }
    }

    function handleSearch(event) {

        event.preventDefault()

        setSearchError('')
        setProductData(null)

        const enteredProductId = productId.trim()

        if (!enteredProductId) {

            setSearchError('Please enter a product ID.')

            return
        }

        fetchProduct(enteredProductId)
    }

    useEffect(() => {

        const product = searchParams.get('product')

        if (product) {

            setProductId(product)

            fetchProduct(product)

        }

    }, [searchParams])

    function formatDate(date) {

        if (!date) {
            return '-'
        }

        return new Date(date).toLocaleString()
    }

    function getStageIcon(role) {

        const normalizedRole = role?.toLowerCase()

        if (normalizedRole === 'manufacturer') {
            return 'bi-building'
        }

        if (normalizedRole === 'distributor') {
            return 'bi-truck'
        }

        if (normalizedRole === 'wholesaler') {
            return 'bi-box-seam'
        }

        if (normalizedRole === 'retailer') {
            return 'bi-shop'
        }

        return 'bi-person'
    }

    function getRoleName(role) {

        if (!role) {
            return 'Participant'
        }

        return role.charAt(0).toUpperCase() + role.slice(1)
    }

    function getCurrentLocation() {

        if (!productData) {
            return '-'
        }

        const transfers = productData.transfers || []

        if (transfers.length === 0) {

            return 'Manufacturer'

        }

        const lastTransfer = transfers[transfers.length - 1]

        return getRoleName(lastTransfer.to_user_role)
    }

    function getCurrentParticipant() {

        if (!productData) {
            return '-'
        }

        const transfers = productData.transfers || []

        if (transfers.length === 0) {

            return productData.manufacturer?.name || 'Manufacturer'

        }

        const lastTransfer = transfers[transfers.length - 1]

        return lastTransfer.to_user_name
    }

    function getCurrentStatus() {

        if (!productData) {
            return '-'
        }

        const transfers = productData.transfers || []

        if (transfers.length === 0) {
            return 'Manufactured'
        }

        const lastTransfer = transfers[transfers.length - 1]

        return lastTransfer.status || 'In Supply Chain'
    }

    return (
        <section className="py-5">

            <div className="container">

                {/* Page Header */}

                <div className="text-center mb-5">

                    <h2 className="fw-bold">
                        Track Product
                    </h2>

                    <p className="text-secondary">
                        Enter a product ID to view its complete supply-chain journey.
                    </p>

                </div>

                {/* Search Product */}

                <div className="card border-0 shadow-sm p-4">

                    <form onSubmit={handleSearch}>

                        <div className="row justify-content-center">

                            <div className="col-md-8">

                                <label
                                    htmlFor="productId"
                                    className="form-label fw-semibold"
                                >
                                    Product ID
                                </label>

                                <div className="input-group">

                                    <input
                                        type="text"
                                        id="productId"
                                        className="form-control"
                                        placeholder="Enter product ID e.g. P001"
                                        value={productId}
                                        onChange={(event) => {

                                            setProductId(event.target.value)
                                            setSearchError('')
                                        }}
                                    />

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >

                                        {loading ? (

                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                ></span>

                                                Tracking...
                                            </>

                                        ) : (

                                            <>
                                                <i className="bi bi-search me-2"></i>
                                                Track
                                            </>

                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    </form>

                </div>

                {/* Search Error */}

                {searchError && (

                    <div className="alert alert-danger mt-4">

                        <i className="bi bi-exclamation-circle me-2"></i>

                        {searchError}

                    </div>

                )}

                {/* Product Data */}

                {productData && (

                    <>

                        {/* Product Information */}

                        <div className="card border-0 shadow-sm p-4 mt-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <h4 className="fw-bold mb-0">
                                    Product Information
                                </h4>

                                <span className="badge bg-success">
                                    Verified
                                </span>

                            </div>

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Product ID
                                    </p>

                                    <h6 className="fw-bold">
                                        {productData.product.product_id}
                                    </h6>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Product Name
                                    </p>

                                    <h6 className="fw-bold">
                                        {productData.product.product_name}
                                    </h6>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Category
                                    </p>

                                    <h6 className="fw-bold">
                                        {productData.product.category}
                                    </h6>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Current Quantity
                                    </p>

                                    <h6 className="fw-bold">
                                        {productData.product.quantity}
                                    </h6>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Current Location
                                    </p>

                                    <h6 className="fw-bold">
                                        {getCurrentLocation()}
                                    </h6>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Current Holder
                                    </p>

                                    <h6 className="fw-bold">
                                        {getCurrentParticipant()}
                                    </h6>

                                </div>

                                <div className="col-md-6">

                                    <p className="text-secondary mb-1">
                                        Product Status
                                    </p>

                                    <span className="badge bg-success">
                                        {productData.product.status}
                                    </span>

                                </div>

                                <div className="col-md-6">

                                    <p className="text-secondary mb-1">
                                        Created
                                    </p>

                                    <h6 className="fw-bold">
                                        {formatDate(
                                            productData.product.created_at
                                        )}
                                    </h6>

                                </div>

                            </div>

                        </div>

                        {/* Manufacturer Information */}

                        <div className="card border-0 shadow-sm p-4 mt-4">

                            <h4 className="fw-bold mb-4">
                                Manufacturer Information
                            </h4>

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Manufacturer
                                    </p>

                                    <h6 className="fw-bold">
                                        {productData.manufacturer?.name || '-'}
                                    </h6>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Email
                                    </p>

                                    <h6 className="fw-bold">
                                        {productData.manufacturer?.email || '-'}
                                    </h6>

                                </div>

                            </div>

                        </div>

                        {/* Supply Chain Journey */}

                        <div className="card border-0 shadow-sm p-4 mt-4">

                            <h4 className="fw-bold mb-4">
                                Supply Chain Journey
                            </h4>

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead>

                                        <tr>
                                            <th>#</th>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Quantity</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {/* Manufacturing Stage */}

                                        <tr>

                                            <td>
                                                <i className="bi bi-building text-primary me-2"></i>
                                                1
                                            </td>

                                            <td>
                                                {productData.manufacturer?.name || '-'}
                                            </td>

                                            <td>
                                                Product Created
                                            </td>

                                            <td>
                                                -
                                            </td>

                                            <td>

                                                <span className="badge bg-success">
                                                    Manufactured
                                                </span>

                                            </td>

                                            <td>
                                                {formatDate(
                                                    productData.product.created_at
                                                )}
                                            </td>

                                        </tr>

                                        {/* Transfer Stages */}

                                        {productData.transfers?.map(
                                            (transfer, index) => (

                                                <tr key={transfer.id}>

                                                    <td>

                                                        <i
                                                            className={`bi ${getStageIcon(
                                                                transfer.to_user_role
                                                            )} text-primary me-2`}
                                                        ></i>

                                                        {index + 2}

                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {transfer.from_user_name}
                                                        </strong>

                                                        <br />

                                                        <small className="text-secondary">
                                                            {getRoleName(
                                                                transfer.from_user_role
                                                            )}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {transfer.to_user_name}
                                                        </strong>

                                                        <br />

                                                        <small className="text-secondary">
                                                            {getRoleName(
                                                                transfer.to_user_role
                                                            )}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        {transfer.quantity}
                                                    </td>

                                                    <td>

                                                        <span className="badge bg-success">
                                                            {transfer.status}
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            transfer.transferred_at
                                                        )}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                            {(!productData.transfers ||
                                productData.transfers.length === 0) && (

                                <div className="alert alert-info mb-0">

                                    <i className="bi bi-info-circle me-2"></i>

                                    This product has not been transferred yet.
                                    It is currently with the manufacturer.

                                </div>

                            )}

                        </div>

                        {/* Visual Product Journey */}

                        <div className="card border-0 shadow-sm p-4 mt-4">

                            <h4 className="fw-bold mb-4">
                                Product Journey
                            </h4>

                            <div className="row g-4">

                                {/* Manufacturer */}

                                <div className="col-md-4">

                                    <div className="card border p-4 h-100 text-center">

                                        <i className="bi bi-building fs-1 text-primary"></i>

                                        <h5 className="fw-bold mt-3">
                                            Manufacturer
                                        </h5>

                                        <p className="fw-semibold mb-1">
                                            {productData.manufacturer?.name || '-'}
                                        </p>

                                        <p className="text-secondary mb-0">
                                            Product created and registered in the supply-chain system.
                                        </p>

                                    </div>

                                </div>

                                {/* Transfer Participants */}

                                {productData.transfers?.map(
                                    (transfer, index) => (

                                        <div
                                            className="col-md-4"
                                            key={transfer.id}
                                        >

                                            <div className="card border p-4 h-100 text-center">

                                                <i
                                                    className={`bi ${getStageIcon(
                                                        transfer.to_user_role
                                                    )} fs-1 text-primary`}
                                                ></i>

                                                <h5 className="fw-bold mt-3">
                                                    {getRoleName(
                                                        transfer.to_user_role
                                                    )}
                                                </h5>

                                                <p className="fw-semibold mb-1">
                                                    {transfer.to_user_name}
                                                </p>

                                                <p className="text-secondary mb-0">
                                                    Received {transfer.quantity} units from{' '}
                                                    {transfer.from_user_name}.
                                                </p>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                        {/* QR Verification */}

                        <div className="card border-0 shadow-sm p-4 mt-4 text-center">

                            <h4 className="fw-bold">
                                QR Product Verification
                            </h4>

                            <p className="text-secondary">
                                This product was opened using its unique QR tracking link.
                            </p>

                            <div className="mt-3">

                                <i className="bi bi-qr-code fs-1 text-success"></i>

                            </div>

                            <p className="text-success fw-semibold mt-3 mb-0">

                                <i className="bi bi-check-circle me-2"></i>

                                Product successfully verified

                            </p>

                        </div>

                    </>

                )}

            </div>

        </section>
    )
}

export default TrackProduct