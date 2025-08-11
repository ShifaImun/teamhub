const User = require('../models/User');

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({})
      .select('name email role department photo birthday hireDate')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      data: employees,
      count: employees.length
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employees'
    });
  }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id)
      .select('name email role department photo birthday hireDate');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employee'
    });
  }
};

// Create new employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, role, department, photo, birthday, hireDate } = req.body;
    
    // Check if employee with same email already exists
    const existingEmployee = await User.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        error: 'Employee with this email already exists'
      });
    }
    
    const newEmployee = new User({
      name,
      email,
      role,
      department,
      photo,
      birthday,
      hireDate,
      password: 'defaultPassword123' // You might want to generate a random password
    });
    
    await newEmployee.save();
    
    res.status(201).json({
      success: true,
      data: {
        _id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
        department: newEmployee.department,
        photo: newEmployee.photo,
        birthday: newEmployee.birthday,
        hireDate: newEmployee.hireDate
      }
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create employee'
    });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { name, email, role, department, photo, birthday, hireDate } = req.body;
    
    // Check if employee exists
    const existingEmployee = await User.findById(req.params.id);
    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    // Check if email is being changed and if it conflicts with another employee
    if (email !== existingEmployee.email) {
      const emailConflict = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (emailConflict) {
        return res.status(400).json({
          success: false,
          error: 'Employee with this email already exists'
        });
      }
    }
    
    const updatedEmployee = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role,
        department,
        photo,
        birthday,
        hireDate
      },
      { new: true }
    ).select('name email role department photo birthday hireDate');
    
    res.json({
      success: true,
      data: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update employee'
    });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete employee'
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
}; 