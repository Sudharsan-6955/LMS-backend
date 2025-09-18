exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body; // 🟡 allow role in request for now

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, role }); // 🟡 optional: default 'user'

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role), // ✅ include role
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role), // ✅ include role
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
