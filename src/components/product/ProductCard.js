import React, { useEffect, useState, useContext } from "react";
import { IoMdStar } from "react-icons/io";
import { Link } from "react-router-dom";
import { displayMoney } from "../../helpers/utils";
import cartContext from "../../contexts/cart/cartContext";
import useActive from "../../hooks/useActive";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const { addItem } = useContext(cartContext);
  const { active, handleActive, activeClass } = useActive(false);

  useEffect(() => {
    fetch("https://ngo-server-xyum.onrender.com/api/products?mode=admin", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        // Assuming data is an array, add the product object to the array
        setProducts(data);
      });
  }, []);

  const handleAddItem = (product) => {
    addItem(product);
    handleActive(product.id);
    setTimeout(() => {
      handleActive(false);
    }, 3000);
  };

  return (
    <div className="products-container">
      {products.map((product) => {
        const newPrice = displayMoney(product.price);
        const oldPrice = displayMoney(product.originalPrice || product.price); // Assuming originalPrice might be in the API or use the same price
        const productRating = [...Array(product.rating)].map((_, i) => <IoMdStar key={i} />);

        return (
          <div className="card products_card" key={product.id}>
            <figure className="products_img">
              <Link to={`/products/${product.slug}`}>
                <img src={product.mainImage ? `/${product.mainImage}` : "/product_placeholder.jpg"} alt={product.title} />
              </Link>
            </figure>
            <div className="products_details">
              <span className="rating_star">
                {productRating}
              </span>
              <h3 className="products_title">
                <Link to={`/products/${product.slug}`}>{product.title}</Link>
              </h3>
              <h5 className="products_info">{product.description}</h5>
              <div className="separator"></div>
              <h2 className="products_price">
                {newPrice} &nbsp;
                {product.originalPrice && <small><del>{oldPrice}</del></small>}
              </h2>
              <button
                type="button"
                className={`btn products_btn ${activeClass(product.id)}`}
                onClick={() => handleAddItem(product)}
              >
                {active ? "Added" : "Add to cart"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCard;
