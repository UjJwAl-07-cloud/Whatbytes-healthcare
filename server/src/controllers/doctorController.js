import prisma from '../config/prisma.js';

/**
 * Create a new doctor.
 * POST /api/doctors/
 */
export const create = async (req, res, next) => {
  try {
    const { name, specialization, email, phone } = req.body;

    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialization,
        email: email || null,
        phone: phone || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully.',
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve all doctors.
 * GET /api/doctors/
 */
export const getAll = async (req, res, next) => {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get details of a specific doctor.
 * GET /api/doctors/:id/
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update doctor details.
 * PUT /api/doctors/:id/
 */
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, specialization, email, phone } = req.body;

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    // Build update data with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (specialization !== undefined) updateData.specialization = specialization;
    if (email !== undefined) updateData.email = email ? email.trim() : null;
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;

    const updatedDoctor = await prisma.doctor.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully.',
      data: updatedDoctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a doctor record.
 * DELETE /api/doctors/:id/
 */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    // Delete doctor (cascade will delete mappings via Prisma schema)
    await prisma.doctor.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
