function About() {
    return (
        <section className="py-5">

            <div className="container">

                <div className="text-center mb-5">

                    <p className="text-primary fw-semibold mb-2">
                        ABOUT THE PROJECT
                    </p>

                    <h2 className="fw-bold">
                        Blockchain Supply Chain Tracking
                    </h2>

                    <p className="text-secondary mt-3">
                        A simple and transparent system for tracking products
                        throughout the supply chain.
                    </p>

                </div>

                <div className="row g-4">

                    <div className="col-lg-6">

                        <div className="card border-0 shadow-sm p-4 h-100">

                            <i className="bi bi-boxes fs-1 text-primary"></i>

                            <h4 className="fw-bold mt-3">
                                What Is This Project?
                            </h4>

                            <p className="text-secondary">
                                This project is a blockchain-based supply chain
                                tracking system that records the movement of
                                products from manufacturers to distributors,
                                retailers and customers.
                            </p>

                            <p className="text-secondary mb-0">
                                Each stage of the supply chain can be recorded
                                and tracked, helping users understand where a
                                product came from and how it moved through the
                                supply chain.
                            </p>

                        </div>

                    </div>

                    <div className="col-lg-6">

                        <div className="card border-0 shadow-sm p-4 h-100">

                            <i className="bi bi-bullseye fs-1 text-primary"></i>

                            <h4 className="fw-bold mt-3">
                                Project Objective
                            </h4>

                            <p className="text-secondary">
                                The main objective is to provide a simple way
                                for small businesses and local supply-chain
                                participants to manage and track their products.
                            </p>

                            <p className="text-secondary mb-0">
                                The system focuses on transparency, traceability
                                and secure product records without making the
                                process difficult for users.
                            </p>

                        </div>

                    </div>

                </div>

                <div className="mt-5">

                    <div className="text-center mb-4">

                        <h3 className="fw-bold">
                            Supply Chain Participants
                        </h3>

                        <p className="text-secondary">
                            The system connects different participants involved
                            in the product journey.
                        </p>

                    </div>

                    <div className="row g-4 text-center">

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm p-4 h-100">

                                <i className="bi bi-building fs-1 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Manufacturer
                                </h5>

                                <p className="text-secondary mb-0">
                                    Creates and registers products in the system
                                    before transferring them to distributors.
                                </p>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm p-4 h-100">

                                <i className="bi bi-truck fs-1 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Distributor
                                </h5>

                                <p className="text-secondary mb-0">
                                    Receives products from manufacturers and
                                    transfers them through the supply chain.
                                </p>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm p-4 h-100">

                                <i className="bi bi-shop fs-1 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Retailer
                                </h5>

                                <p className="text-secondary mb-0">
                                    Receives products and makes them available
                                    to customers.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="card border-0 shadow-sm p-4 mt-5">

                    <div className="text-center">

                        <i className="bi bi-shield-check fs-1 text-primary"></i>

                        <h3 className="fw-bold mt-3">
                            Transparency and Traceability
                        </h3>

                        <p className="text-secondary mb-0">
                            The system is designed to provide a clear record of
                            product movement so that authorized participants
                            and customers can understand the product journey.
                        </p>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default About