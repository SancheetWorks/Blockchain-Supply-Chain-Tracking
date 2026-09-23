import { useEffect, useState } from 'react'
import {
    getDistributorInventory,
    getDistributorTransfers
} from '../services/api'
import { useNavigate } from 'react-router-dom'

function RetailerDashboard() {

    const user = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()

    const [inventory, setInventory] = useState([])
    const [transfers, setTransfers] = useState([])

    const [loadingInventory, setLoadingInventory] = useState(true)
    const [loadingTransfers, setLoadingTransfers] = useState(true)

    const [productId, setProductId] = useState('')

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    async function loadInventory() {

        try {

            const data = await getDistributorInventory(user.id)

            setInventory(data)

        } catch (error) {

            setError(error.message)

        } finally {

            setLoadingInventory(false)

        }
    }

    async function loadTransfers() {

        try {

            const data = await getDistributorTransfers(user.id)

            setTransfers(data)

        } catch (error) {

            setError(error.message)

        } finally {

            setLoadingTransfers(false)

        }
    }

    useEffect(() => {

        loadInventory()
        loadTransfers()

    }, [])

    function handleTrackProduct(event) {

        event.preventDefault()

        setMessage('')
        setError('')

        if (!productId.trim()) {

            setError('Please enter a product ID')
            return

        }

        navigate(`/track?product=${productId}`)

    }

    return (
        <section className="py-5">

            <div className="container">

                <div className="mb-4">

                    <h2 className="fw-bold">
                        Retailer Dashboard
                    </h2>

                    <p className="text-secondary">
                        Manage received products, inventory and product tracking.
                    </p>

                </div>

                {message && (
                    <div className="alert alert-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <div className="row g-4">

                    <div className="col-md-6 col-lg-3">

                        <div className="card border-0 shadow-sm p-4 h-100">

                            <i className="bi bi-box-arrow-in-down fs-2 text-primary"></i>

                            <h5 className="fw-bold mt-3">
                                Received Products
                            </h5>

                            <p className="text-secondary mb-0">
                                View products received from distributors.
                            </p>

                        </div>

                    </div>

                    <div className="col-md-6 col-lg-3">

                        <div className="card border-0 shadow-sm p-4 h-100">

                            <i className="bi bi-box-seam fs-2 text-primary"></i>

                            <h5 className="fw-bold mt-3">
                                My Inventory
                            </h5>

                            <p className="text-secondary mb-0">
                                View products currently available in your inventory.
                            </p>

                        </div>

                    </div>

                    <div className="col-md-6 col-lg-3">

                        <div className="card border-0 shadow-sm p-4 h-100">

                            <i className="bi bi-search fs-2 text-primary"></i>

                            <h5 className="fw-bold mt-3">
                                Track Product
                            </h5>

                            <p className="text-secondary mb-0">
                                Search for a product and view its journey.
                            </p>

                        </div>

                    </div>

                    <div className="col-md-6 col-lg-3">

                        <div className="card border-0 shadow-sm p-4 h-100">

                            <i className="bi bi-clock-history fs-2 text-primary"></i>

                            <h5 className="fw-bold mt-3">
                                Product History
                            </h5>

                            <p className="text-secondary mb-0">
                                View product transfer history.
                            </p>

                        </div>

                    </div>

                </div>

                <div className="card border-0 shadow-sm p-4 mt-4">

                    <h4 className="fw-bold mb-4">
                        Received Products
                    </h4>

                    {loadingInventory ? (

                        <p className="text-secondary">
                            Loading received products...
                        </p>

                    ) : inventory.length === 0 ? (

                        <p className="text-secondary">
                            No received products yet.
                        </p>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>

                                    <tr>
                                        <th>Product ID</th>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {inventory.map((product) => (

                                        <tr key={product.id}>

                                            <td>
                                                {product.product_id}
                                            </td>

                                            <td>
                                                {product.product_name}
                                            </td>

                                            <td>
                                                {product.category}
                                            </td>

                                            <td>
                                                {product.quantity}
                                            </td>

                                            <td>
                                                <span className="badge bg-success">
                                                    Available
                                                </span>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                <div className="card border-0 shadow-sm p-4 mt-4">

                    <h4 className="fw-bold mb-4">
                        My Inventory
                    </h4>

                    {loadingInventory ? (

                        <p className="text-secondary">
                            Loading inventory...
                        </p>

                    ) : inventory.length === 0 ? (

                        <p className="text-secondary">
                            No products in inventory yet.
                        </p>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>

                                    <tr>
                                        <th>Product ID</th>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Quantity</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {inventory.map((product) => (

                                        <tr key={product.id}>

                                            <td>
                                                {product.product_id}
                                            </td>

                                            <td>
                                                {product.product_name}
                                            </td>

                                            <td>
                                                {product.category}
                                            </td>

                                            <td>
                                                {product.quantity}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                <div className="card border-0 shadow-sm p-4 mt-4">

                    <h4 className="fw-bold mb-2">
                        Track Product
                    </h4>

                    <p className="text-secondary">
                        Enter a product ID to view its supply-chain journey.
                    </p>

                    <form onSubmit={handleTrackProduct}>

                        <div className="row">

                            <div className="col-md-8 mb-3">

                                <label
                                    htmlFor="productId"
                                    className="form-label"
                                >
                                    Product ID
                                </label>

                                <input
                                    type="text"
                                    id="productId"
                                    className="form-control"
                                    placeholder="Enter product ID"
                                    value={productId}
                                    onChange={(event) =>
                                        setProductId(event.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            <i className="bi bi-search me-2"></i>
                            Track Product
                        </button>

                    </form>

                </div>

                <div className="card border-0 shadow-sm p-4 mt-4">

                    <h4 className="fw-bold mb-4">
                        Product History
                    </h4>

                    {loadingTransfers ? (

                        <p className="text-secondary">
                            Loading product history...
                        </p>

                    ) : transfers.length === 0 ? (

                        <p className="text-secondary">
                            No product history available.
                        </p>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>

                                    <tr>
                                        <th>Product ID</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {transfers.map((transfer) => (

                                        <tr key={transfer.id}>

                                            <td>
                                                {transfer.product_id}
                                            </td>

                                            <td>
                                                {transfer.from_user_id}
                                            </td>

                                            <td>
                                                {transfer.to_user_id}
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
                                                {new Date(
                                                    transfer.transferred_at
                                                ).toLocaleDateString()}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </section>
    )
}

export default RetailerDashboard