// schoolService.js
import axios from 'axios';

let schoolData = {};

// Function to fetch school data and assign it to the schoolData object
export const fetchSchoolData = async () => {
  try {
    const response = await axios.get('https://api.gurukulerp.in/api/school/getSchool'); // Adjust the URL to match your API
    schoolData = response.data[0];
    console.log('School data fetched successfully:', response.data);
  } catch (error) {
    console.error('Failed to fetch school data:', error);
    throw error;
  }
};

// Export individual fields as variables (use getters for lazy access)
console.log(schoolData);
export const getSchoolName = () => schoolData.schoolName;
export const getSchoolCode = () => schoolData.schoolCode;
export const getPhone1 = () => schoolData.phone1;
export const getPhone2 = () => schoolData.phone2;
export const getEmail1 = () => schoolData.email1;
export const getEmail2 = () => schoolData.email2;
export const getAddress = () => schoolData.address;
export const getLogo = () => schoolData.logo;
export const getWebsite = () => schoolData.website;
export const getCreatedAt = () => schoolData.createdAt;
export const getUpdatedAt = () => schoolData.updatedAt;
