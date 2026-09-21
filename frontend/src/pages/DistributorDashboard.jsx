import { useEffect, useState } from 'react'
import {
    getDistributorInventory,
    getDistributorTransfers,
    transferProduct
} from '../services/api'

function DistributorDashboard() {

    const user = JSON.parse(localStorage.getItem('user'))

    const [inventory, setInventory] = useState([])
    const [transfers, setTransfers] = useState([])

    const [loadingInventory, setLoadingInventory] = useState(true)
    const [loadingTransfers, setLoadingTransfers] = useState(true)

    const [transferData, setTransferData] = useState({
        product_id: '',
        to_user_id: '',
        quantity: ''
    })

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

    function handleTransferChange(event) {

        setTransferData({
            ...transferData,
            [event.target.id]: event.target.value
        })

    }

    async function handleTransferSubmit(event) {

        event.preventDefault()

        setMessage('')
        setError('')

        try {

            const data = await transferProduct({
                product_id: Number(transferData.product_id),
                from_user_id: user.id,
                to_user_id: Number(transferData.to_user_id),
                quantity: Number(transferData.quantity)
            })

            setMessage(data.message)

            setTransferData({
                product_id: '',
                to_user_id: '',
                quantity: ''
            })

            loadInventory()
            loadTransfers()

        } catch (error) {

            setError(error.message)

        }
    }

    return (
        <section className="py-5">

            <div className="container">

                <div className="mb-4">

                    <h2 className="fw-bold">
                        Distributor Dashboard
                    </h2>

                    <p className="text-secondary">
                        Manage received products, inventory and product transfers.
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
                                View products received from manufacturers.
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

                            <i className="bi bi-truck fs-2 text-primary"></i>

                            <h5 className="fw-bold mt-3">
                                Transfer Product
                            </h5>

                            <p className="text-secondary mb-0">
                                Transfer products to retailers.
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
                                View the movement history of your products.
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
                        Transfer Product
                    </h4>

                    <p className="text-secondary">
                        Transfer products from your inventory to a retailer.
                    </p>

                    <form onSubmit={handleTransferSubmit}>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="product_id"
                                    className="form-label"
                                >
                                    Product ID
                                </label>

                                <input
                                    type="number"
                                    id="product_id"
                                    className="form-control"
                                    placeholder="Enter product ID"
                                    min="1"
                                    value={transferData.product_id}
                                    onChange={handleTransferChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="to_user_id"
                                    className="form-label"
                                >
                                    Retailer ID
                                </label>

                                <input
                                    type="number"
                                    id="to_user_id"
                                    className="form-control"
                                    placeholder="Enter retailer ID"
                                    min="1"
                                    value={transferData.to_user_id}
                                    onChange={handleTransferChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="quantity"
                                    className="form-label"
                                >
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    id="quantity"
                                    className="form-control"
                                    placeholder="Enter quantity"
                                    min="1"
                                    value={transferData.quantity}
                                    onChange={handleTransferChange}
                                    required
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary mt-2"
                        >
                            <i className="bi bi-arrow-right-circle me-2"></i>
                            Transfer Product
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

export default DistributorDashboard