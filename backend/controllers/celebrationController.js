const User = require('../models/User');
const Celebration = require('../models/Celebration');

const getAllCelebrations = async (req, res) => {
  try {
    const customCelebrations = await Celebration.find({ isActive: true })
      .populate('employeeId', 'name photo')
      .sort({ date: 1 });

    const users = await User.find({})
      .select('name photo birthday hireDate')
      .sort({ name: 1 });

    const employeeCelebrations = [];
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    users.forEach(user => {
      const birthday = new Date(user.birthday);
      const currentYear = today.getFullYear();
      birthday.setFullYear(currentYear);
      if (birthday < today) birthday.setFullYear(currentYear + 1);

      const daysUntilBirthday = Math.ceil((birthday - today) / (1000 * 60 * 60 * 24));
      employeeCelebrations.push({
        id: user._id,
        name: user.name,
        event: 'Birthday',
        date: birthday.toISOString().split('T')[0],
        photo: user.photo,
        daysUntil: daysUntilBirthday,
        isToday: daysUntilBirthday === 0,
        isEmployeeBased: true
      });

      const hireDate = new Date(user.hireDate);
      hireDate.setFullYear(currentYear);
      if (hireDate < today) hireDate.setFullYear(currentYear + 1);

      const daysUntilAnniversary = Math.ceil((hireDate - today) / (1000 * 60 * 60 * 24));
      const yearsOfService = today.getFullYear() - new Date(user.hireDate).getFullYear();
      employeeCelebrations.push({
        id: user._id,
        name: user.name,
        event: 'Work Anniversary',
        date: hireDate.toISOString().split('T')[0],
        photo: user.photo,
        daysUntil: daysUntilAnniversary,
        isToday: daysUntilAnniversary === 0,
        yearsOfService,
        isEmployeeBased: true
      });
    });

    const allCelebrations = [
      ...customCelebrations.map(celeb => ({
        id: celeb._id,
        name: celeb.name,
        event: celeb.event,
        date: celeb.date.toISOString().split('T')[0],
        photo: celeb.photo,
        description: celeb.description,
        daysUntil: celeb.daysUntil || Math.ceil((celeb.date - today) / (1000 * 60 * 60 * 24)),
        isToday: celeb.isToday || false,
        isEmployeeBased: false,
        isCustom: celeb.isCustom || celeb.event === 'Custom Celebration'
      })),
      ...employeeCelebrations
    ];

    allCelebrations.sort((a, b) => a.daysUntil - b.daysUntil);

    // Classification logic
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const todayList = allCelebrations.filter(c => c.isToday);
    const thisWeekList = allCelebrations.filter(c => {
      const dateObj = new Date(c.date);
      return dateObj >= startOfWeek && dateObj <= endOfWeek;
    });
    const thisMonthList = allCelebrations.filter(c => {
      const dateObj = new Date(c.date);
      return dateObj >= startOfMonth && dateObj <= endOfMonth;
    });
    const allUpcomingList = allCelebrations.filter(c => !c.isToday);

    res.json({
      success: true,
      data: allCelebrations,
      count: allCelebrations.length,
      classification: {
        today: todayList,
        thisWeek: thisWeekList,
        thisMonth: thisMonthList,
        allUpcoming: allUpcomingList
      },
      // This matches your request: "upcoming celebrations" in dashboard = this week only
      upcomingCelebrationsCount: thisWeekList.length
    });
  } catch (error) {
    console.error('Error fetching celebrations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch celebrations'
    });
  }
};

// KEEPING all your other endpoints unchanged:
const getCelebrationById = async (req, res) => { /* ...same as yours... */ };
const createCelebration = async (req, res) => { /* ...same as yours... */ };
const updateCelebration = async (req, res) => { /* ...same as yours... */ };
const deleteCelebration = async (req, res) => { /* ...same as yours... */ };
const getUpcomingCelebrations = async (req, res) => { /* ...same as yours... */ };
const getTodayCelebrations = async (req, res) => { /* ...same as yours... */ };

module.exports = {
  getAllCelebrations,
  getCelebrationById,
  createCelebration,
  updateCelebration,
  deleteCelebration,
  getUpcomingCelebrations,
  getTodayCelebrations
};
