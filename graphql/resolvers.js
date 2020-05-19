const Product = require('../models/product');

module.exports = { 
    Query: {
        products: async() => {
            const products = await Product.find();
            return products;
        },
        product: async(_, { id }, { redis, redisClient }) => {
            const getCache = await redisClient.getAsync('product:' + id);
            if (getCache){
                return JSON.parse(getCache);
            } else {
                const product = await Product.findById(id);
                if (!product){
                    const error = new Error('No product found!');
                    error.code = 404;
                    throw error;
                }
                redisClient.setex('product:' + id, 3600, JSON.stringify(product));
                return {
                    ...product._doc,
                    createdAt: product.createdAt.toISOString(),
                    updatedAt: product.updatedAt.toISOString()
                  };
            }        
        }
    },
    Mutation: {
        createProduct: async(_, body, { redisClient }) => {
            const product = new Product({
                title: body.title,
                price: body.price,
                description: body.description,
                images: body.images
            })
            const createdProduct = await product.save();
            
            redisClient.setex('product:' + createdProduct._id.toString(), 3600, JSON.stringify(createdProduct));

            return {
                ...createdProduct._doc,
                createdAt: createdProduct.createdAt.toISOString(),
                updatedAt: createdProduct.updatedAt.toISOString()
              };
        },
        updateProduct: async(_, { id, productInput }, { redisClient }) => {
            const product = await Product.findById(id);
            console.log(product);
            if (!product){
                const error = new Error('No product found!');
                error.code = 404;
                throw error;
            }

            let keys = Object.keys(productInput);
            console.log(keys);

            keys.forEach(k => product[k] = productInput[k]);
            product.save();
            redisClient.setex('product:' + product._id.toString(), 3600, JSON.stringify(product));

            return {
                ...product._doc,
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString()
              };
        }
    }
 };