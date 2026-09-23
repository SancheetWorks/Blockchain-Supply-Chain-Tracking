import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="bg-dark text-white py-4">

            <div className="container">

                <div className="row align-items-center">

                    <div className="col-md-6 text-center text-md-start">

                        <p className="mb-1 fw-bold">
                            <i className="bi bi-box-seam me-2"></i>
                            Blockchain Supply Chain Tracking
                        </p>

                        <p className="mb-0 text-secondary">
                            Secure. Transparent. Traceable.
                        </p>

                    </div>

                    <div className="col-md-6 mt-3 mt-md-0">

                        <div className="d-flex justify-content-center justify-content-md-end gap-3">

                            <Link
                                className="text-white text-decoration-none"
                                to="/"
                            >
                                Home
                            </Link>

                            <Link
                                className="text-white text-decoration-none"
                                to="/track"
                            >
                                Track Product
                            </Link>

                            <Link
                                className="text-white text-decoration-none"
                                to="/about"
                            >
                                About
                            </Link>

                        </div>

                    </div>

                </div>

                <hr className="border-secondary my-3" />

                <div className="text-center">

                    <p className="mb-0 text-secondary">
                        © 2026 Blockchain Supply Chain Tracking. All rights reserved.
                    </p>

                </div>

            </div>

        </footer>
    )
}

export default Footer