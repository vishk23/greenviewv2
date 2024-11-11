import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import { doc, getDoc } from "firebase/firestore";

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState<{ name: string; email: string; bio: string; phoneNumber?: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setProfileData(userDoc.data() as { name: string; email: string; bio: string; phoneNumber?: string });
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
      <div className="profile-page">
        <h1>Profile</h1>
        <div className="profile-info">
          <p><strong>Name:</strong> {profileData.name || "Not set"}</p>
          <p><strong>Email:</strong> {profileData.email || "Not set"}</p>
          <p><strong>Phone Number:</strong> {profileData.phoneNumber || "Not set"}</p>
          <p><strong>Bio:</strong> {profileData.bio || "Not set"}</p>
        </div> 
    </div>
  );
};

export default Profile;
