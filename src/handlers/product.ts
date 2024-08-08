import { Request, Response } from 'express';
import Product from '../models/Product.model';
import { body } from 'express-validator';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      order: [['id', 'DESC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.json({ data: products });
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        error: `El id:${id} no generó ninguna respuesta`,
      });
    }
    res.json({ data: product });
  } catch (error) {
    return res.status(404).json({
      error: 'URL No válido',
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        error: `El id:${id} no generó ninguna respuesta`,
      });
    }

    //Actualizar
    await product.update(req.body);
    await product.save();

    res.json({ data: product });
  } catch (error) {
    console.log('Error');
  }
};

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        error: `El id:${id} no generó ninguna respuesta`,
      });
    }

    //Actualizar
    product.available = !product.dataValues.available;
    await product.save();

    res.json({ data: product });
  } catch (error) {
    console.log('Error');
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        error: `El id:${id} no generó ninguna respuesta`,
      });
    }

    //Eliminar
    await product.destroy();

    res.json(`El producto id: ${id} se eliminó correctamente`);
  } catch (error) {
    console.log('Error');
  }
};
