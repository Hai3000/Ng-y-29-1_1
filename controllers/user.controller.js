const User = require("../models/user.model");

exports.createUser = async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
};

exports.getAllUsers = async (req, res) => {
    const users = await User.find({ deleted: false }).populate("role");
    res.json(users);
};

exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).populate("role");
    res.json(user);
};

exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
};

exports.deleteUser = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { deleted: true });
    res.json({ message: "Soft delete user" });
};

exports.enableUser = async (req, res) => {

    const { email, username } = req.body;

    const user = await User.findOne({ email, username });

    if (!user) {
        return res.json({ message: "User not found" });
    }

    user.status = true;
    await user.save();

    res.json({ message: "User enabled" });
};

exports.disableUser = async (req, res) => {

    const { email, username } = req.body;

    const user = await User.findOne({ email, username });

    if (!user) {
        return res.json({ message: "User not found" });
    }

    user.status = false;
    await user.save();

    res.json({ message: "User disabled" });
};

exports.getUsersByRole = async (req, res) => {

    const roleId = req.params.id;

    const users = await User.find({
        role: roleId,
        deleted: false
    }).populate("role");

    res.json(users);
};