import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, db } from "./config/firebase";
import Signup from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";
import SignIn from "./components/SignIn/SignIn";
import { collection, doc, getDoc } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [isUser, setisUser] = useState(false); // State to track admin role

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);

        // Fetch user role from Firestore and check if it's admin
        const userDocRef = doc(collection(db, "users"), authUser.uid);
       
        const userDocSnapshot = await getDoc(userDocRef);
        console.log(userDocSnapshot.data().role)
        if (userDocSnapshot.exists() && userDocSnapshot.data().role === "user") {
          setisUser(true);
        } else {
          setisUser(false);
        }
      } else {
        setUser(null);
        setisUser(false); // Reset admin status if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setisUser(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isEmailVerified = user && user.emailVerified;

  return (
    <Router>
      <div className="App">
        {isEmailVerified && isUser && (
          <nav>
            <ul>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </nav>
        )}

        <Routes>
          {isEmailVerified && isUser ? (
            <>
            <Route path="/home" element={<Home />} />
            <Route path="/*" element={<Home />} />
            </>
          ) : (
            <>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/signin" element={<SignIn/>} />
            <Route path="/*" element={<Navigate to="/signup" />} />
            </>
          )}

         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
