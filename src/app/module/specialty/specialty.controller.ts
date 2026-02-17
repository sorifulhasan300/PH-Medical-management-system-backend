/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { specialtiesService } from "./specialty.service";

const getAllSpecialties = async (req: Request, res: Response) => {
  try {
    const specialties = await specialtiesService.getAllSpecialties();
    res.status(200).json({
      success: true,
      message: "Specialties retrieved successfully",
      data: specialties,
    });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to retrieve specialties" });
  }
};

const createSpecialty = async (req: Request, res: Response) => {
  try {
    const specialties = await specialtiesService.createSpecialty(req.body);
    res.status(201).json({
      success: true,
      message: "Specialty created successfully",
      data: specialties,
    });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to create specialty" });
  }
};

const deleteSpecialty = async (req: Request, res: Response) => {
  try {
    const specialties = await specialtiesService.deleteSpecialty(
      req.params.id as string,
    );
    res.status(201).json({
      success: true,
      message: "Specialty deleted successfully",
      data: specialties,
    });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to delete specialty" });
  }
};

const updateSpecialty = async (req: Request, res: Response) => {
  try {
    const specialties = await specialtiesService.updateSpecialty(
      req.params.id as string,
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Specialty updated successfully",
      data: specialties,
    });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to update specialty" });
  }
};
export const specialtiesController = {
  getAllSpecialties,
  createSpecialty,
  deleteSpecialty,
  updateSpecialty,
};
