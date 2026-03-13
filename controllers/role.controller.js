const Role = require("../models/role.model");

exports.createRole = async (req, res) => {
    const role = await Role.create(req.body);
    res.json(role);
};

exports.getAllRoles = async (req, res) => {
    const roles = await Role.find();
    res.json(roles);
};

exports.getRoleById = async (req, res) => {
    const role = await Role.findById(req.params.id);
    res.json(role);
};

exports.updateRole = async (req, res) => {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(role);
};

exports.deleteRole = async (req, res) => {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: "Role deleted" });
};