import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const ProductCard = ({ product, onAddToCart, onRemoveFromCart, inCart = false }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden h-full flex flex-col">
      {/* Image */}
      <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Name */}
        <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>

        {/* Price & Unit */}
        <div className="flex items-center justify-between my-2">
          <span className="text-2xl font-bold text-primary">₹{product.price}</span>
          <span className="text-sm text-gray-600">{product.unit}</span>
        </div>

        {/* Stock Status */}
        <div className="mb-3">
          {product.inStock ? (
            <span className="text-sm text-green-600 font-semibold">{t('inStock')}</span>
          ) : (
            <span className="text-sm text-red-600 font-semibold">{t('outOfStock')}</span>
          )}
          {product.stock && (
            <p className="text-xs text-gray-500">{t('stock')}{product.stock}</p>
          )}
        </div>

        {/* Button */}
        {product.inStock ? (
          <button
            onClick={() => {
              if (inCart) {
                onRemoveFromCart(product._id);
              } else {
                onAddToCart(product);
              }
            }}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              inCart
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-primary text-white hover:bg-primaryDark'
            }`}
          >
            {inCart ? t('removeFromCart') : t('addToCart')}
          </button>
        ) : (
          <button disabled className="w-full py-2 rounded-lg font-semibold bg-gray-300 text-gray-600">
            {t('outOfStock')}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
