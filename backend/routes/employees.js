const express = require('express');
const router = express.Router();
const { 
  getAllEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} = require('../controllers/employeeController');

// GET /api/employees - Get all employees
router.get('/', getAllEmployees);

// POST /api/employees - Create new employee
router.post('/', createEmployee);

// GET /api/employees/:id - Get employee by ID
router.get('/:id', getEmployeeById);

// PUT /api/employees/:id - Update employee
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', deleteEmployee);

module.exports = router; 