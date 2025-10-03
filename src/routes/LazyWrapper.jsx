import React, { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const LazyWrapper = ({ children }) => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            {children}
        </Suspense>
    );
};

export default LazyWrapper;
