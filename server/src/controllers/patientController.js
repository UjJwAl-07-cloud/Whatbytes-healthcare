import prisma from '../config/prisma.js';

/**
 * Create a new patient.
 * POST /api/patients/
 */
export const create = async (req, res, next) => {
  try {
    const { name, age, gender, address, phone } = req.body;

    const patient = await prisma.patient.create({
      data: {
        name,
        age,
        gender,
        address: address || null,
        phone: phone || null,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully.',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve all patients created by the authenticated user.
 * GET /api/patients/
 */
export const getAll = async (req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get details of a specific patient.
 * GET /api/patients/:id/
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!patient || patient.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update patient details.
 * PUT /api/patients/:id/
 */
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, age, gender, address, phone } = req.body;

    // Find patient and verify ownership
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!patient || patient.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.',
      });
    }

    // Build update data with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address ? address.trim() : null;
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;

    const updatedPatient = await prisma.patient.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully.',
      data: updatedPatient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a patient record.
 * DELETE /api/patients/:id/
 */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find patient and verify ownership
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!patient || patient.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.',
      });
    }

    // Delete patient (cascade will delete mappings via Prisma schema)
    await prisma.patient.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
