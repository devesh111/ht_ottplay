/**
 * API Response Utilities
 * Standardized response formatting for OpenAPI 3.0 compliance
 */

import { NextResponse } from "next/server";

// /**
//  * Success response wrapper
//  * @param {*} data - Response data
//  * @param {number} statusCode - HTTP status code (default: 200)
//  * @param {string} message - Success message
//  * @returns {NextResponse} Formatted success response
//  */
export const successResponse = (
    data,
    statusCode = 200,
    message = "Success",
) => {
    return NextResponse.json(
        {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        },
        { status: statusCode },
    );
};

// /**
//  * Error response wrapper
//  * @param {string} message - Error message
//  * @param {number} statusCode - HTTP status code (default: 500)
//  * @param {string} errorCode - Error code for client handling
//  * @param {*} details - Additional error details
//  * @returns {NextResponse} Formatted error response
//  */
export const errorResponse = (
    message,
    statusCode = 500,
    errorCode = "INTERNAL_ERROR",
    details = null,
) => {
    const response = {
        success: false,
        error: {
            code: errorCode,
            message,
            statusCode,
        },
        timestamp: new Date().toISOString(),
    };

    if (details) {
        response.error.details = details;
    }

    return NextResponse.json(response, { status: statusCode });
};

// /**
//  * Paginated response wrapper
//  * @param {Array} data - Array of items
//  * @param {number} page - Current page number
//  * @param {number} limit - Items per page
//  * @param {number} total - Total number of items
//  * @param {string} message - Success message
//  * @returns {NextResponse} Formatted paginated response
//  */
export const paginatedResponse = (
    data,
    page,
    limit,
    total,
    message = "Success",
) => {
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
        {
            success: true,
            message,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
            timestamp: new Date().toISOString(),
        },
        { status: 200 },
    );
};

// /**
//  * Handle API errors and return formatted response
//  * @param {Error} error - Error object
//  * @returns {NextResponse} Formatted error response
//  */
export const handleApiError = (error) => {
    console.error("API Error:", error);

    // Handle custom AppError
    if (error.statusCode && error.errorCode) {
        return errorResponse(
            error.message,
            error.statusCode,
            error.errorCode,
            error.details,
        );
    }

    // Handle Prisma errors
    if (error.code === "P2002") {
        return errorResponse("Unique constraint violation", 409, "CONFLICT", {
            field: error.meta?.target?.[0],
        });
    }

    if (error.code === "P2025") {
        return errorResponse("Record not found", 404, "NOT_FOUND");
    }

    // Default error
    return errorResponse(
        error.message || "Internal server error",
        500,
        "INTERNAL_ERROR",
    );
};
