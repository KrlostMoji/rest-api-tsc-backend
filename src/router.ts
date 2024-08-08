import { Router } from 'express';
import { body, param } from 'express-validator';
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from './handlers/product';
import { handleInputErrors } from './middleware/index';

const router = Router();

/**
 * @swagger
 *    components:
 *       schemas:
 *          Product:
 *             type: object
 *             properties:
 *                id:
 *                   type: integer
 *                   description: The Product ID
 *                   example: 1
 *                name:
 *                   type: string
 *                   description: The Product name
 *                   example: Monitor de 40 pulgadas
 *                price:
 *                   type: number
 *                   description: The Product price
 *                   example: 300
 *                available:
 *                   type: boolean
 *                   description: The Product availability
 *                   example: true
 */

/**
 * @swagger
 * /api/products:
 *    get:
 *       summary: Get all the products
 *       tags:
 *          - Products
 *       description: Get a list of the products in the database.
 *       responses:
 *          200:
 *             description: Successful response
 *             content:
 *                application/json:
 *                   schema:
 *                      type: array
 *                      items:
 *                         $ref: '#/components/schemas/Product'
 *          404:
 *             description: Not found
 */

/**
 * @swagger
 * /api/products/{id}:
 *    get:
 *       summary: Get an especific product
 *       tags:
 *          - Products
 *       description: Return a product by an especific ID (unique key)
 *       parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product selected
 *            require: true
 *            schema:
 *               type: integer
 *       responses:
 *          200:
 *             description: Successful response
 *             content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Product'
 *          404:
 *             description: Not found
 *          400:
 *             description: Bad Request - Invalid ID
 */

//Routing
router.get('/', getProducts);

router.get('/:id', param('id').isInt().withMessage('Id no válido'), getProductById);

/**
 * @swagger
 * /api/products:
 *    post:
 *       summary: Create a new Product
 *       tags:
 *          - Products
 *       description: Create a new record in the database, returns the new register
 *       requestBody:
 *          required: true
 *          content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      name:
 *                         type: string
 *                         example: "Monitor de 40 pulgadas"
 *                      price:
 *                         type: number
 *                         example: 399
 *       responses:
 *          201:
 *             description: Product created successfully
 *             content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Product'
 *          400:
 *             description: Bad Request - Invalid ID
 *
 */

router.post(
  '/',

  //Validación
  body('name').notEmpty().withMessage('Favor de proporcionar el nombre del producto'),
  body('price')
    .custom((value) => value > 0)
    .withMessage('Se esperaba un valor numérico mayor a 0')
    .notEmpty()
    .withMessage('Favor de proporcionar el nombre del producto'),
  handleInputErrors,
  createProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *    put:
 *       summary: Update an especific product
 *       tags:
 *          - Products
 *       description: Update and return the uptaded product, modify the database record
 *       parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product selected
 *            require: true
 *            schema:
 *               type: integer
 *       requestBody:
 *          required: true
 *          content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      name:
 *                         type: string
 *                         example: "Monitor de 40 pulgadas"
 *                      price:
 *                         type: number
 *                         example: 399
 *                      available:
 *                         type: boolean
 *                         example: true
 *       responses:
 *          200:
 *             description: Successful response
 *             content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Product'
 *          404:
 *             description: Not found
 *          400:
 *             description: Bad Request - Invalid ID
 */

router.put(
  '/:id',
  //Validación
  param('id').isInt().withMessage('Id no válido'),
  body('name').notEmpty().withMessage('Favor de proporcionar el nombre del producto'),
  body('price')
    .custom((value) => value > 0)
    .withMessage('Se esperaba un valor numérico mayor a 0')
    .notEmpty()
    .withMessage('Favor de proporcionar el nombre del producto'),
  body('available').isBoolean().withMessage('Se espera un valor booleano'),
  handleInputErrors,
  updateProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *    patch:
 *       summary: Return the updated availability
 *       tags:
 *          - Products
 *       description: Return the updated availability by the product ID
 *       parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product selected
 *            require: true
 *            schema:
 *               type: integer
 *       responses:
 *          200:
 *             description: Successful response
 *             content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Product'
 *          404:
 *             description: Not found
 *          400:
 *             description: Bad Request - Invalid ID
 *
 *
 */

router.patch('/:id', param('id').isInt().withMessage('Id no válido'), handleInputErrors, updateAvailability);

/**
 * @swagger
 * /api/products/{id}:
 *    delete:
 *       summary: Delete an especific Product
 *       tags:
 *          - Products
 *       description: Delete a product by their specific id
 *       parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product selected
 *            require: true
 *            schema:
 *               type: integer
 *       responses:
 *          200:
 *             description: Successful response
 *             content:
 *                application/json:
 *                   schema:
 *                      type: string
 *                      value: 'Producto eliminado'
 *          404:
 *             description: Not found
 *          400:
 *             description: Bad Request - Invalid ID
 *
 *
 */

router.delete('/:id', param('id').isInt().withMessage('Id no válido'), handleInputErrors, deleteProduct);

export default router;
