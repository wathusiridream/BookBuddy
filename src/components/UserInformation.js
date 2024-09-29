import React, { useState } from 'react';
import { auth, db, storage } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../WebStyle/style.css'; // Import your CSS

function UserInformation() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    telephone: '',
    address: '',
    thaiID: '',
    idCardImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'idCardImage') {
      setFormData((prev) => ({ ...prev, idCardImage: files[0] }));
      setImagePreview(URL.createObjectURL(files[0])); // Create image preview URL
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getAuth().currentUser;
    if (!user) {
      alert('Please sign in first.');
      return;
    }

    try {
      let imageUrl = '';

      if (formData.idCardImage) {
        const storageRef = ref(storage, `idCards/${formData.idCardImage.name}`);
        const snapshot = await uploadBytes(storageRef, formData.idCardImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        lastName: formData.lastName,
        telephone: formData.telephone,
        address: formData.address,
        thaiID: formData.thaiID,
        idCardImageUrl: imageUrl,
        email: user.email,
      });

      alert('User information saved successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error saving user data: ', error);
      alert('Error saving user data. Please try again.');
    }
  };

  return (
    <div className="custom-background">
      <div className="user-info-page">
        <div className="container">
          <div className="user-information">
            <h1>User Information</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name :</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Last Name :</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Telephone :</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Address :</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Thai ID :</label>
                <input
                  type="text"
                  name="thaiID"
                  value={formData.thaiID}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Thai ID Card Image :</label>
                <input
                  type="file"
                  name="idCardImage"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              {imagePreview && (
                <div >
                  <img src={imagePreview} alt="ID Card Preview" style={{ width: '200px', height: 'auto' }} />
                </div>
              )}
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInformation;
