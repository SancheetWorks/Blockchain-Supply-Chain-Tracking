import { Link } from 'react-router-dom'

function Home() {
    return (
        <>
            <section className="hero-section">

                <div className="container">

                    <div className="row align-items-center min-vh-75">

                        <div className="col-lg-7">

                            <p className="text-primary fw-semibold mb-2">
                                BLOCKCHAIN SUPPLY CHAIN
                            </p>

                            <h1 className="display-4 fw-bold">
                                Track Your Products With
                                <span className="text-primary">
                                    {' '}Trust & Transparency
                                </span>
                            </h1>

                            <p className="lead text-secondary mt-3">
                                Track products from manufacturer to customer using a secure
                                blockchain-based supply chain system.
                            </p>

                            <div className="mt-4">

                                <Link
                                    to="/track"
                                    className="btn btn-primary btn-lg me-2"
                                >
                                    <i className="bi bi-search me-2"></i>
                                    Track Product
                                </Link>

                                <Link
                                    to="/about"
                                    className="btn btn-outline-dark btn-lg"
                                >
                                    Learn More
                                </Link>

                            </div>

                        </div>

                        <div className="col-lg-5 text-center mt-5 mt-lg-0">

                            <div className="hero-icon">
                                <i className="bi bi-boxes"></i>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <section className="py-5 bg-light">

                <div className="container">

                    <div className="text-center mb-5">

                        <h2 className="fw-bold">
                            How It Works
                        </h2>

                        <p className="text-secondary">
                            Follow the complete journey of a product through the supply
                            chain.
                        </p>

                    </div>

                    <div className="row g-4 text-center">

                        <div className="col-md-3">

                            <div className="card h-100 border-0 shadow-sm p-4">

                                <i className="bi bi-building fs-1 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Manufacturer
                                </h5>

                                <p className="text-secondary mb-0">
                                    Product is created and registered in the system.
                                </p>

                            </div>

                        </div>

                        <div className="col-md-3">

                            <div className="card h-100 border-0 shadow-sm p-4">

                                <i className="bi bi-truck fs-1 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Distributor
                                </h5>

                                <p className="text-secondary mb-0">
                                    Product is transferred to the distributor.
                                </p>

                            </div>

                        </div>

                        <div className="col-md-3">

                            <div className="card h-100 border-0 shadow-sm p-4">

                                <i className="bi bi-shop fs-1 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Retailer
                                </h5>

                                <p className="text-secondary mb-0">
                                    Retailer receives and manages the product.
                                </p>

                            </div>

                        </div>

                        <div className="col-md-3">

                            <div className="card h-100 border-0 shadow-sm p-4">

                                <i className="bi bi-person-check fs-1 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Customer
                                </h5>

                                <p className="text-secondary mb-0">
                                    Customer verifies the product journey.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <section className="py-5">

                <div className="container">

                    <div className="text-center mb-5">

                        <h2 className="fw-bold">
                            Key Features
                        </h2>

                        <p className="text-secondary">
                            Simple tools for transparent and traceable supply chains.
                        </p>

                    </div>

                    <div className="row g-4">

                        <div className="col-md-4">

                            <div className="feature-card p-4 text-center h-100">

                                <i className="bi bi-link-45deg fs-1 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Blockchain Tracking
                                </h5>

                                <p className="text-secondary">
                                    Maintain a transparent record of product movements.
                                </p>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="feature-card p-4 text-center h-100">

                                <i className="bi bi-qr-code-scan fs-1 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    QR Verification
                                </h5>

                                <p className="text-secondary">
                                    Scan a QR code to view the product journey.
                                </p>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="feature-card p-4 text-center h-100">

                                <i className="bi bi-shield-check fs-1 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Secure Records
                                </h5>

                                <p className="text-secondary">
                                    Keep important supply-chain records secure and traceable.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <section className="py-5 bg-light">

                <div className="container">

                    <div className="text-center">

                        <h2 className="fw-bold">
                            Track Your Product
                        </h2>

                        <p className="text-secondary">
                            Check the journey of your product from manufacturer to retailer.
                        </p>

                        <Link
                            to="/track"
                            className="btn btn-primary mt-2"
                        >
                            <i className="bi bi-search me-2"></i>
                            Start Tracking
                        </Link>

                    </div>

                </div>

            </section>
        </>
    )
}

export default Home