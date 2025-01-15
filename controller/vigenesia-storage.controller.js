export const vigenesiaStorageUploadFile = async (file) => {
  const url = `${process.env.VIGENESIA_STORAGE_ENDPOINT}/upload`; // Endpoint upload server
  const formData = new FormData();

  // Kirim buffer file ke FormData
  formData.append("file", new Blob([file.buffer]), file.originalname); // Menggunakan Blob untuk buffer file

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Failed to upload file: ${response.statusText}, Detail: ${errorDetail}`);
    }

    const result = await response.json();
    console.log("File uploaded successfully:", result);
    return result;
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw error; // Lempar error agar bisa ditangani di tempat lain
  }
};


export const vigenesiaStorageGetFileLink =  (fileName) => {
  return `${process.env.VIGENESIA_STORAGE_ENDPOINT}/file/${fileName}`;
};