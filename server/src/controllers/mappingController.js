import prisma from '../config/prisma.js';

/**
 * Assign a doctor to a patient.
 * POST /api/mappings/
 */
export const create = async (req, res, next) => {
  try {
    const { patientId, doctorId } = req.body;

    // Verify patient exists and belongs to the authenticated user
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient || patient.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found or does not belong to you.',
      });
    }

    // Verify doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    // Check for existing mapping (duplicate)
    const existingMapping = await prisma.patientDoctorMapping.findUnique({
      where: {
        patientId_doctorId: {
          patientId,
          doctorId,
        },
      },
    });

    if (existingMapping) {
      return res.status(409).json({
        success: false,
        message: 'This doctor is already assigned to this patient.',
      });
    }

    // Create the mapping
    const mapping = await prisma.patientDoctorMapping.create({
      data: {
        patientId,
        doctorId,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Doctor assigned to patient successfully.',
      data: mapping,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve all patient-doctor mappings for the authenticated user's patients.
 * GET /api/mappings/
 */
export const getAll = async (req, res, next) => {
  try {
    const mappings = await prisma.patientDoctorMapping.findMany({
      where: {
        patient: {
          userId: req.user.id,
        },
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: mappings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all doctors assigned to a specific patient.
 * GET /api/mappings/:patientId/
 */
export const getByPatientId = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const parsedPatientId = parseInt(patientId, 10);

    // Verify patient exists and belongs to the authenticated user
    const patient = await prisma.patient.findUnique({
      where: { id: parsedPatientId },
    });

    if (!patient || patient.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found or does not belong to you.',
      });
    }

    const mappings = await prisma.patientDoctorMapping.findMany({
      where: { patientId: parsedPatientId },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: {
        patient: {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
        },
        doctors: mappings.map((m) => ({
          mappingId: m.id,
          ...m.doctor,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a doctor from a patient (delete a mapping).
 * DELETE /api/mappings/:id/
 */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    // Find the mapping and include patient to verify ownership
    const mapping = await prisma.patientDoctorMapping.findUnique({
      where: { id: parsedId },
      include: {
        patient: {
          select: { userId: true },
        },
      },
    });

    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Mapping not found.',
      });
    }

    // Verify the associated patient belongs to the authenticated user
    if (mapping.patient.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Mapping not found.',
      });
    }

    // Delete mapping only (not patient or doctor)
    await prisma.patientDoctorMapping.delete({
      where: { id: parsedId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
