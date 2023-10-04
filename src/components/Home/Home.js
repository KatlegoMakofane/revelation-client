import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaTshirt } from 'react-icons/fa';

const Home = () => {
  const [products, setProducts] = useState([]);
 
  useEffect(() => {
    const fetchProductsForAllUsers = async () => {
      try {
        const adminsCollectionRef = collection(db, "admins");
        const adminsSnapshot = await getDocs(adminsCollectionRef);

        const allProductsData = [];

        for (const adminDoc of adminsSnapshot.docs) {
          const userUid = adminDoc.id;
          const productsCollectionRef = collection(adminDoc.ref, "products");
          const querySnapshot = await getDocs(productsCollectionRef);

          querySnapshot.forEach((doc) => {
            allProductsData.push({ id: doc.id, ...doc.data(), userUid });
          });
        }

        setProducts(allProductsData);
        console.log("Fetched products for all users:", allProductsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductsForAllUsers();
  }, []);
  
  // Rest of your component code...

  return (
    <div className="Home">
      <h2>Home</h2>
     
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <div>
              {product.colorImages ? (
                <img
                  src={
                    product.colorImages.Blue ||
                    product.colorImages.Red ||
                    product.colorImages.Green ||
                    product.colorImages.Brown ||
                    product.colorImages.Black ||
                    product.colorImages.White ||
                    product.colorImages.Yellow ||
                    product.colorImages.Orange ||
                    product.colorImages.Purple
                  }
                  alt="product"
                  className="InventoryImage"
                />
              ) : (
                <FaTshirt size={50} />
              )}
              <p>Product Name: {product.productName}</p>
              <p>Price: {product.price}</p>
              <p>Colors: {product.availableColors.join(", ")}</p>
              <p>User UID: {product.userUid}</p> {/* Display the user UID for reference */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
