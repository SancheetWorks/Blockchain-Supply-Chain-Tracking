import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

function TrackProduct() {

    const [searchParams] = useSearchParams()

    const [productId, setProductId] = useState('')
    const [searchedProduct, setSearchedProduct] = useState(null)

    function handleSearch(event) {

        event.preventDefault()

        if (!productId.trim()) {
            return
        }

        setSearchedProduct(productId.trim())
    }

    useEffect(() => {

        const product = searchParams.get('product')

        if (product) {
            setProductId(product)
            setSearchedProduct(product)
        }

    }, [searchParams])

    return (
        <section className="py-5">

            <div className="container">

                <div className="text-center mb-5">

                    <h2 className="fw-bold">
                        Track Product
                    </h2>

                    <p className="text-secondary">
                        Enter a product ID to view its complete supply-chain journey.
                    </p>

                </div>

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
                                        onChange={(event) =>
                                            setProductId(event.target.value)
                                        }
                                        required
                                    />

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        <i className="bi bi-search me-2"></i>
                                        Track
                                    </button>

                                </div>

                            </div>

                        </div>

                    </form>

                </div>

                {searchedProduct && (

                    <>

                        <div className="card border-0 shadow-sm p-4 mt-4">

                            <h4 className="fw-bold mb-4">
                                Product Information
                            </h4>

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Product ID
                                    </p>

                                    <h6 className="fw-bold">
                                        {searchedProduct}
                                    </h6>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Product Name
                                    </p>

                                    <h6 className="fw-bold">
                                        Product information will appear here
                                    </h6>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Category
                                    </p>

                                    <h6 className="fw-bold">
                                        -
                                    </h6>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <p className="text-secondary mb-1">
                                        Current Status
                                    </p>

                                    <span className="badge bg-success">
                                        Trackable
                                    </span>

                                </div>

                            </div>

                        </div>

                        <div className="card border-0 shadow-sm p-4 mt-4">

                            <h4 className="fw-bold mb-4">
                                Supply Chain Journey
                            </h4>

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead>

                                        <tr>
                                            <th>Stage</th>
                                            <th>Participant</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        <tr>

                                            <td>
                                                <i className="bi bi-building text-primary me-2"></i>
                                                Manufacturer
                                            </td>

                                            <td>
                                                Manufacturer
                                            </td>

                                            <td>
                                                <span className="badge bg-success">
                                                    Completed
                                                </span>
                                            </td>

                                            <td>
                                                -
                                            </td>

                                        </tr>

                                        <tr>

                                            <td>
                                                <i className="bi bi-truck text-primary me-2"></i>
                                                Distributor
                                            </td>

                                            <td>
                                                Distributor
                                            </td>

                                            <td>
                                                <span className="badge bg-success">
                                                    Completed
                                                </span>
                                            </td>

                                            <td>
                                                -
                                            </td>

                                        </tr>

                                        <tr>

                                            <td>
                                                <i className="bi bi-shop text-primary me-2"></i>
                                                Retailer
                                            </td>

                                            <td>
                                                Retailer
                                            </td>

                                            <td>
                                                <span className="badge bg-warning text-dark">
                                                    Current
                                                </span>
                                            </td>

                                            <td>
                                                -
                                            </td>

                                        </tr>

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        <div className="card border-0 shadow-sm p-4 mt-4">

                            <h4 className="fw-bold mb-4">
                                Product Journey
                            </h4>

                            <div className="row g-4">

                                <div className="col-md-4">

                                    <div className="card border p-4 h-100 text-center">

                                        <i className="bi bi-building fs-1 text-primary"></i>

                                        <h5 className="fw-bold mt-3">
                                            Manufacturer
                                        </h5>

                                        <p className="text-secondary mb-0">
                                            Product created and registered in
                                            the supply-chain system.
                                        </p>

                                    </div>

                                </div>

                                <div className="col-md-4">

                                    <div className="card border p-4 h-100 text-center">

                                        <i className="bi bi-truck fs-1 text-primary"></i>

                                        <h5 className="fw-bold mt-3">
                                            Distributor
                                        </h5>

                                        <p className="text-secondary mb-0">
                                            Product transferred and received
                                            by the distributor.
                                        </p>

                                    </div>

                                </div>

                                <div className="col-md-4">

                                    <div className="card border p-4 h-100 text-center">

                                        <i className="bi bi-shop fs-1 text-primary"></i>

                                        <h5 className="fw-bold mt-3">
                                            Retailer
                                        </h5>

                                        <p className="text-secondary mb-0">
                                            Product reaches the retailer for
                                            final distribution.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="card border-0 shadow-sm p-4 mt-4 text-center">

                            <h4 className="fw-bold">
                                QR Product Verification
                            </h4>

                            <p className="text-secondary">
                                Scan the product QR code to verify its journey.
                            </p>

                            <div className="mt-3">

                                <i className="bi bi-qr-code fs-1 text-primary"></i>

                            </div>

                            <p className="text-secondary mt-3 mb-0">
                                QR verification will be connected later.
                            </p>

                        </div>

                    </>

                )}

            </div>

        </section>
    )
}

export default TrackProduct