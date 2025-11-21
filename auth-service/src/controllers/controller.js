const registerUser = (req, res) => {
  try {
    console.log("New User Registered");
    res.json({ message: "New User Registered" });
  } catch (error) {
    console.log(error);
  }
};
const loginUser = (req, res) => {
  try {
    console.log("User Logged In");
    res.json({ message: "User Logged In" });
  } catch (error) {
    console.log(error);
  }
};
const logoutUser = (req, res) => {
  try {
    console.log("User logged out");
    res.json({ message: "User Logged Out" });
  } catch (error) {
    console.log(error);
  }
};

export { loginUser, logoutUser, registerUser };
