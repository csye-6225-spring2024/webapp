const handlePayloadChecks = (req, res, next) => {

    // Check if 'content-length' header is present and greater than 0
    if (req.headers['content-length'] && req.headers['content-length'] > 0) {
        logger.warn('Content length header present and greater than 0.');
        return res
            .status(400)
            .set("Cache-Control", "no-cache, no-store, must-revalidate")
            .set("Pragma", "no-cache")
            .set("X-Content-Type-Options", "nosniff")
            .send();
    }

    // Check if req.body is defined and non-empty
    if (req.body && Object.keys(req.body).length > 0) {
        logger.warn('Request body is defined and non-empty.');
        return res
            .status(400)
            .set("Cache-Control", "no-cache, no-store, must-revalidate")
            .set("Pragma", "no-cache")
            .set("X-Content-Type-Options", "nosniff")
            .send();
    }

    // Check if query parameters are present
    if (req.query && Object.keys(req.query).length > 0) {
        logger.warn('Query parameters are present.');
        return res
            .status(400)
            .set("Cache-Control", "no-cache, no-store, must-revalidate")
            .set("Pragma", "no-cache")
            .set("X-Content-Type-Options", "nosniff")
            .send();
    }
    next();
};

export { handlePayloadChecks };
