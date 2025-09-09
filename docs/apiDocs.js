import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * API documentation object containing all endpoint information
 * This object is used to generate the API documentation page
 */
const documentation = {
  title: 'Natours API Documentation',
  version: '2.2.0',
  description:
    'Complete REST API for Tours Management Platform with Advanced Geospatial Features',
  // baseUrl will be dynamically set in the route handler

  endpoints: {
    authentication: {
      description: 'User authentication and authorization endpoints',
      routes: [
        {
          method: 'POST',
          path: '/api/v1/users/signup',
          description: 'Register a new user account',
          authentication: 'None',
        },
        {
          method: 'POST',
          path: '/api/v1/users/login',
          description: 'Login with email and password to get JWT token',
          authentication: 'None',
        },
        {
          method: 'GET',
          path: '/api/v1/users/logout',
          description: 'Logout current user (clears JWT cookie)',
          authentication: 'None',
        },
        {
          method: 'POST',
          path: '/api/v1/users/forgotPassword',
          description: 'Request password reset token via email',
          authentication: 'None',
        },
        {
          method: 'PATCH',
          path: '/api/v1/users/resetPassword/:token',
          description: 'Reset password using token from email',
          authentication: 'None',
        },
        {
          method: 'PATCH',
          path: '/api/v1/users/updatePassword',
          description: 'Update current user password',
          authentication: 'Bearer Token Required',
        },
      ],
    },

    tours: {
      description:
        'Tour management with advanced filtering and geospatial features',
      routes: [
        {
          method: 'GET',
          path: '/api/v1/tours',
          description:
            'Get all tours with advanced filtering, sorting, and pagination',
          authentication: 'None',
        },
        {
          method: 'GET',
          path: '/api/v1/tours/top-5-cheap',
          description: 'Get top 5 cheapest tours (pre-configured alias)',
          authentication: 'None',
        },
        {
          method: 'GET',
          path: '/api/v1/tours/tour-stats',
          description:
            'Get comprehensive tour statistics aggregated by difficulty level',
          authentication: 'None',
        },
        {
          method: 'GET',
          path: '/api/v1/tours/monthly-plan/:year',
          description:
            'Get monthly tour distribution and planning data for specific year',
          authentication: 'Bearer Token Required (admin/lead-guide roles)',
        },
        {
          method: 'GET',
          path:
            '/api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit',
          description:
            'Find tours within specified distance from coordinates (geospatial query)',
          authentication: 'None',
          example:
            '/api/v1/tours/tours-within/400/center/34.111745,-118.113491/unit/mi',
        },
        {
          method: 'GET',
          path: '/api/v1/tours/distances/:latlng/unit/:unit',
          description:
            'Calculate distances from coordinates to all tour starting points',
          authentication: 'None',
          example: '/api/v1/tours/distances/40.7128,-74.0060/unit/km',
        },
        {
          method: 'GET',
          path: '/api/v1/tours/:id',
          description:
            'Get single tour by ID with populated reviews and guides',
          authentication: 'None',
        },
        {
          method: 'POST',
          path: '/api/v1/tours',
          description: 'Create a new tour',
          authentication: 'Bearer Token Required (admin/lead-guide only)',
        },
        {
          method: 'PATCH',
          path: '/api/v1/tours/:id',
          description: 'Update tour by ID',
          authentication: 'Bearer Token Required (admin/lead-guide only)',
        },
        {
          method: 'DELETE',
          path: '/api/v1/tours/:id',
          description: 'Delete tour by ID',
          authentication: 'Bearer Token Required (admin/lead-guide only)',
        },
      ],
    },

    users: {
      description: 'User management and profile endpoints',
      routes: [
        {
          method: 'GET',
          path: '/api/v1/users/me',
          description: 'Get current user profile',
          authentication: 'Bearer Token Required',
        },
        {
          method: 'PATCH',
          path: '/api/v1/users/updateMe',
          description: 'Update current user name and email (not password)',
          authentication: 'Bearer Token Required',
        },
        {
          method: 'GET',
          path: '/api/v1/users',
          description: 'Get all users',
          authentication: 'Bearer Token Required (admin only)',
        },
        {
          method: 'POST',
          path: '/api/v1/users',
          description: 'Create new user (admin function)',
          authentication: 'Bearer Token Required (admin only)',
        },
        {
          method: 'GET',
          path: '/api/v1/users/:id',
          description: 'Get user by ID',
          authentication: 'Bearer Token Required (admin only)',
        },
        {
          method: 'PATCH',
          path: '/api/v1/users/:id',
          description: 'Update user by ID',
          authentication: 'Bearer Token Required (admin only)',
        },
        {
          method: 'DELETE',
          path: '/api/v1/users/:id',
          description: 'Delete user by ID',
          authentication: 'Bearer Token Required (admin only)',
        },
      ],
    },

    reviews: {
      description: 'Review management with automatic ratings calculation',
      routes: [
        {
          method: 'GET',
          path: '/api/v1/reviews',
          description: 'Get all reviews with pagination and filtering',
          authentication: 'None',
        },
        {
          method: 'GET',
          path: '/api/v1/tours/:tourId/reviews',
          description: 'Get all reviews for a specific tour',
          authentication: 'None',
        },
        {
          method: 'POST',
          path: '/api/v1/tours/:tourId/reviews',
          description: 'Create a review for a specific tour',
          authentication: 'Bearer Token Required (user role only)',
          note:
            'Tour and user are automatically set. Users can only review each tour once.',
        },
        {
          method: 'GET',
          path: '/api/v1/reviews/:id',
          description: 'Get single review by ID',
          authentication: 'None',
        },
        {
          method: 'PATCH',
          path: '/api/v1/reviews/:id',
          description: 'Update review (own reviews only)',
          authentication: 'Bearer Token Required (user role only)',
          note: 'Users can only update their own reviews',
        },
        {
          method: 'DELETE',
          path: '/api/v1/reviews/:id',
          description: 'Delete review (own reviews only)',
          authentication: 'Bearer Token Required (user role only)',
          note:
            'Users can only delete their own reviews. Automatically recalculates tour ratings after deletion',
        },
      ],
    },
  },

  geospatialFeatures: {
    description:
      'Advanced location-based queries using MongoDB geospatial operators and 2dsphere indexes',
    availableEndpoints: [
      'GET /api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit - Find tours within radius',
      'GET /api/v1/tours/distances/:latlng/unit/:unit - Calculate distances to all tours',
    ],
    supportedQueries: [
      'Find tours within specific distance from coordinates (radius search)',
      'Calculate distances from a point to all tour starting locations',
      'GeoJSON Point format for precise coordinate handling',
      'Support for miles and kilometers distance units',
    ],
    coordinateFormat: 'latitude,longitude (e.g., 34.111745,-118.113491)',
    useCases: [
      'Find tours near user location',
      'Search tours within travel distance',
      'Calculate travel distances for trip planning',
      'Location-based tour recommendations',
    ],
    examples: {
      findToursNearLosAngeles:
        '/api/v1/tours/tours-within/400/center/34.111745,-118.113491/unit/mi',
      findToursNearNewYork:
        '/api/v1/tours/tours-within/200/center/40.7128,-74.0060/unit/km',
      calculateDistancesFromMiami:
        '/api/v1/tours/distances/25.7617,-80.1918/unit/mi',
      calculateDistancesFromLondon:
        '/api/v1/tours/distances/51.5074,-0.1278/unit/km',
    },
  },
};

/**
 * Function to get the API documentation with dynamic baseUrl
 * @param {Object} req - Express request object
 * @returns {Object} - Documentation object with baseUrl set
 */
export const getApiDocs = req => {
  // Clone the documentation object to avoid modifying the original
  const docs = { ...documentation };

  // Set the baseUrl dynamically based on request
  docs.baseUrl = `${req.protocol}://${req.get('host')}/api/v1`;

  return docs;
};

export default getApiDocs;
